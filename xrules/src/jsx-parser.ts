/**
 * JSX/TSX Parser for Phase 4: Type System Integration
 *
 * This module provides TypeScript-aware parsing of React components,
 * extracting HTML patterns from JSX for rule checking.
 */

import {
  Project,
  SyntaxKind,
  Node,
  JsxElement,
  JsxSelfClosingElement,
  JsxFragment,
  SourceFile,
  FunctionDeclaration,
  VariableDeclaration,
  ArrowFunction,
  ReturnStatement,
} from 'ts-morph';

/**
 * Represents a JSX element extracted from a component
 */
export interface JsxNode {
  tagName: string;
  attributes: Record<string, string>;
  children: JsxNode[];
  text?: string;
  isFragment?: boolean;
}

/**
 * Represents a component and its possible return values
 */
export interface ComponentAnalysis {
  name: string;
  filePath: string;
  possibleReturns: JsxNode[];
  hasConditionalRendering: boolean;
  dependencies: string[]; // Other components this component uses
}

/**
 * JSX Parser for analyzing React/TSX components
 */
export class JsxParser {
  private project: Project;

  constructor(tsConfigPath?: string) {
    this.project = new Project({
      tsConfigFilePath: tsConfigPath,
      skipAddingFilesFromTsConfig: !tsConfigPath,
    });
  }

  /**
   * Add a source file to the project
   */
  addSourceFile(filePath: string): SourceFile {
    return this.project.addSourceFileAtPath(filePath);
  }

  /**
   * Add source code from string
   */
  addSourceFromText(code: string, filePath: string = 'component.tsx'): SourceFile {
    return this.project.createSourceFile(filePath, code, { overwrite: true });
  }

  /**
   * Analyze a component and extract all possible JSX returns
   */
  analyzeComponent(sourceFile: SourceFile, componentName?: string): ComponentAnalysis[] {
    const components: ComponentAnalysis[] = [];

    // Find all function components
    const functions = sourceFile.getFunctions();
    for (const func of functions) {
      if (!componentName || func.getName() === componentName) {
        const analysis = this.analyzeFunctionComponent(func);
        if (analysis) {
          components.push(analysis);
        }
      }
    }

    // Find all arrow function components (const Component = () => ...)
    const variables = sourceFile.getVariableDeclarations();
    for (const variable of variables) {
      if (!componentName || variable.getName() === componentName) {
        const initializer = variable.getInitializer();
        if (initializer && Node.isArrowFunction(initializer)) {
          const analysis = this.analyzeArrowComponent(variable.getName(), initializer);
          if (analysis) {
            components.push(analysis);
          }
        }
      }
    }

    return components;
  }

  /**
   * Analyze a function component
   */
  private analyzeFunctionComponent(func: FunctionDeclaration): ComponentAnalysis | null {
    const name = func.getName();
    if (!name) return null;

    // Check if it returns JSX (heuristic: starts with capital letter)
    if (!/^[A-Z]/.test(name)) return null;

    const possibleReturns: JsxNode[] = [];
    const dependencies = new Set<string>();
    let hasConditionalRendering = false;

    // Find all return statements
    const returns = func.getDescendantsOfKind(SyntaxKind.ReturnStatement);

    for (const returnStmt of returns) {
      const expr = returnStmt.getExpression();
      if (!expr) continue;

      // Check if this return is inside a conditional
      const parent = returnStmt.getParent();
      if (parent && (
        Node.isIfStatement(parent) ||
        Node.isConditionalExpression(parent) ||
        Node.isSwitchStatement(parent)
      )) {
        hasConditionalRendering = true;
      }

      const jsxNode = this.extractJsxFromExpression(expr, dependencies);
      if (jsxNode) {
        possibleReturns.push(jsxNode);
      }
    }

    if (possibleReturns.length === 0) return null;

    return {
      name,
      filePath: func.getSourceFile().getFilePath(),
      possibleReturns,
      hasConditionalRendering,
      dependencies: Array.from(dependencies),
    };
  }

  /**
   * Analyze an arrow function component
   */
  private analyzeArrowComponent(name: string, arrow: ArrowFunction): ComponentAnalysis | null {
    // Check if it returns JSX (heuristic: starts with capital letter)
    if (!/^[A-Z]/.test(name)) return null;

    const possibleReturns: JsxNode[] = [];
    const dependencies = new Set<string>();
    let hasConditionalRendering = false;

    // Check if arrow function directly returns JSX (no braces)
    const body = arrow.getBody();

    if (Node.isJsxElement(body) || Node.isJsxSelfClosingElement(body) || Node.isJsxFragment(body)) {
      const jsxNode = this.extractJsxNode(body, dependencies);
      if (jsxNode) {
        possibleReturns.push(jsxNode);
      }
    } else if (Node.isBlock(body)) {
      // Find all return statements in the block
      const returns = body.getDescendantsOfKind(SyntaxKind.ReturnStatement);

      for (const returnStmt of returns) {
        const expr = returnStmt.getExpression();
        if (!expr) continue;

        // Check if this return is inside a conditional
        const parent = returnStmt.getParent();
        if (parent && (
          Node.isIfStatement(parent) ||
          Node.isConditionalExpression(parent) ||
          Node.isSwitchStatement(parent)
        )) {
          hasConditionalRendering = true;
        }

        const jsxNode = this.extractJsxFromExpression(expr, dependencies);
        if (jsxNode) {
          possibleReturns.push(jsxNode);
        }
      }
    } else if (Node.isParenthesizedExpression(body)) {
      const expr = body.getExpression();
      const jsxNode = this.extractJsxFromExpression(expr, dependencies);
      if (jsxNode) {
        possibleReturns.push(jsxNode);
      }
    }

    if (possibleReturns.length === 0) return null;

    return {
      name,
      filePath: arrow.getSourceFile().getFilePath(),
      possibleReturns,
      hasConditionalRendering,
      dependencies: Array.from(dependencies),
    };
  }

  /**
   * Extract JSX from an expression
   */
  private extractJsxFromExpression(expr: Node, dependencies: Set<string>): JsxNode | null {
    // Unwrap parenthesized expressions
    let current = expr;
    while (Node.isParenthesizedExpression(current)) {
      current = current.getExpression();
    }

    return this.extractJsxNode(current, dependencies);
  }

  /**
   * Extract JSX node structure
   */
  private extractJsxNode(node: Node, dependencies: Set<string>): JsxNode | null {
    if (Node.isJsxElement(node)) {
      return this.extractJsxElement(node, dependencies);
    } else if (Node.isJsxSelfClosingElement(node)) {
      return this.extractJsxSelfClosingElement(node, dependencies);
    } else if (Node.isJsxFragment(node)) {
      return this.extractJsxFragment(node, dependencies);
    } else if (Node.isConditionalExpression(node)) {
      // Handle ternary: condition ? <A /> : <B />
      const whenTrue = this.extractJsxFromExpression(node.getWhenTrue(), dependencies);
      const whenFalse = this.extractJsxFromExpression(node.getWhenFalse(), dependencies);

      // For now, return the "true" branch, but mark that there are alternatives
      // In a full implementation, we'd track both branches
      return whenTrue || whenFalse;
    } else if (Node.isJsxExpression(node)) {
      const expr = node.getExpression();
      if (expr) {
        return this.extractJsxFromExpression(expr, dependencies);
      }
    }

    return null;
  }

  /**
   * Extract JSX element (with opening and closing tags)
   */
  private extractJsxElement(element: JsxElement, dependencies: Set<string>): JsxNode {
    const openingElement = element.getOpeningElement();
    const tagNameNode = openingElement.getTagNameNode();
    const tagName = tagNameNode.getText();

    // Track component dependencies
    if (/^[A-Z]/.test(tagName)) {
      dependencies.add(tagName);
    }

    const attributes = this.extractAttributes(element);
    const children: JsxNode[] = [];

    for (const child of element.getJsxChildren()) {
      if (Node.isJsxElement(child) || Node.isJsxSelfClosingElement(child) || Node.isJsxFragment(child)) {
        const childNode = this.extractJsxNode(child, dependencies);
        if (childNode) {
          children.push(childNode);
        }
      } else if (Node.isJsxText(child)) {
        const text = child.getText().trim();
        if (text) {
          children.push({
            tagName: '#text',
            attributes: {},
            children: [],
            text,
          });
        }
      } else if (Node.isJsxExpression(child)) {
        const expr = child.getExpression();
        if (expr) {
          const jsxNode = this.extractJsxFromExpression(expr, dependencies);
          if (jsxNode) {
            children.push(jsxNode);
          }
        }
      }
    }

    return {
      tagName,
      attributes,
      children,
    };
  }

  /**
   * Extract self-closing JSX element
   */
  private extractJsxSelfClosingElement(element: JsxSelfClosingElement, dependencies: Set<string>): JsxNode {
    const tagNameNode = element.getTagNameNode();
    const tagName = tagNameNode.getText();

    // Track component dependencies
    if (/^[A-Z]/.test(tagName)) {
      dependencies.add(tagName);
    }

    const attributes = this.extractAttributes(element);

    return {
      tagName,
      attributes,
      children: [],
    };
  }

  /**
   * Extract JSX fragment (<>...</>)
   */
  private extractJsxFragment(fragment: JsxFragment, dependencies: Set<string>): JsxNode {
    const children: JsxNode[] = [];

    for (const child of fragment.getJsxChildren()) {
      if (Node.isJsxElement(child) || Node.isJsxSelfClosingElement(child) || Node.isJsxFragment(child)) {
        const childNode = this.extractJsxNode(child, dependencies);
        if (childNode) {
          children.push(childNode);
        }
      } else if (Node.isJsxText(child)) {
        const text = child.getText().trim();
        if (text) {
          children.push({
            tagName: '#text',
            attributes: {},
            children: [],
            text,
          });
        }
      }
    }

    return {
      tagName: '#fragment',
      attributes: {},
      children,
      isFragment: true,
    };
  }

  /**
   * Extract attributes from JSX element
   */
  private extractAttributes(element: JsxElement | JsxSelfClosingElement): Record<string, string> {
    const attributes: Record<string, string> = {};
    const openingElement = Node.isJsxElement(element) ? element.getOpeningElement() : element;

    for (const attr of openingElement.getAttributes()) {
      if (Node.isJsxAttribute(attr)) {
        const name = attr.getNameNode().getText();
        const initializer = attr.getInitializer();

        // Convert React attributes to HTML attributes
        const htmlName = this.reactToHtmlAttribute(name);

        if (initializer) {
          if (Node.isStringLiteral(initializer)) {
            attributes[htmlName] = initializer.getLiteralValue();
          } else if (Node.isJsxExpression(initializer)) {
            const expr = initializer.getExpression();
            if (expr && Node.isStringLiteral(expr)) {
              attributes[htmlName] = expr.getLiteralValue();
            } else {
              // For dynamic expressions, use placeholder
              attributes[htmlName] = '{expression}';
            }
          }
        } else {
          // Boolean attribute (e.g., disabled, required)
          attributes[htmlName] = 'true';
        }
      } else if (Node.isJsxSpreadAttribute(attr)) {
        // Handle spread attributes {...props}
        attributes['data-spread'] = 'true';
      }
    }

    return attributes;
  }

  /**
   * Convert React attribute names to HTML attribute names
   */
  private reactToHtmlAttribute(name: string): string {
    const mapping: Record<string, string> = {
      'className': 'class',
      'htmlFor': 'for',
      'tabIndex': 'tabindex',
      'readOnly': 'readonly',
      'maxLength': 'maxlength',
      'minLength': 'minlength',
      'autoComplete': 'autocomplete',
      'autoFocus': 'autofocus',
      'srcSet': 'srcset',
      'crossOrigin': 'crossorigin',
      'noValidate': 'novalidate',
    };

    return mapping[name] || name.toLowerCase();
  }

  /**
   * Convert JsxNode to HTML string for rule checking
   */
  jsxNodeToHtml(node: JsxNode): string {
    if (node.tagName === '#text') {
      return node.text || '';
    }

    if (node.tagName === '#fragment' || node.isFragment) {
      return node.children.map(child => this.jsxNodeToHtml(child)).join('');
    }

    // Skip React components (capitalized), convert to placeholder divs
    const tagName = /^[A-Z]/.test(node.tagName) ? 'div' : node.tagName;

    const attrs = Object.entries(node.attributes)
      .filter(([key]) => key !== 'data-spread')
      .map(([key, value]) => {
        if (value === 'true') {
          return key; // Boolean attribute
        }
        if (value === '{expression}') {
          return `${key}="..."`; // Dynamic value
        }
        return `${key}="${value}"`;
      })
      .join(' ');

    const attrString = attrs ? ' ' + attrs : '';

    if (node.children.length === 0) {
      // Self-closing tags
      const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link'];
      if (selfClosing.includes(tagName)) {
        return `<${tagName}${attrString} />`;
      }
      return `<${tagName}${attrString}></${tagName}>`;
    }

    const childrenHtml = node.children.map(child => this.jsxNodeToHtml(child)).join('');
    return `<${tagName}${attrString}>${childrenHtml}</${tagName}>`;
  }
}
