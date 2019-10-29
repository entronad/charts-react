import { TextStyleSpec } from '../chart/cartesian/axis/spec/axis-spec';
import { FillPatternType } from '../chart/common/chart-canvas';
import { Color } from '../common/color';
import { TypedRegistry } from '../common/typed-registry';

import { AttributeKey, Series, TypedAccessorFn } from './series';

// A tree structure that contains metadata of a rendering tree.
export class Tree<T, D> {
  // Unique identifier for this [tree].
  readonly id: string;

  // Root node of this tree.
  readonly root: TreeNode<T>;

  // Accessor function that returns the domain for a tree node.
  readonly domainFn: TypedAccessorFn<TreeNode<T>, D>;

  // Accessor function that returns the measure for a tree node.
  readonly measureFn: TypedAccessorFn<TreeNode<T>, number>;

  // Accessor function that returns the rendered stroke color for a tree node.
  readonly colorFn: TypedAccessorFn<TreeNode<T>, Color>;

  // Accessor function that returns the rendered fill color for a tree node.
  // If not provided, then [colorFn] will be used as a fallback.
  readonly fillColorFn: TypedAccessorFn<TreeNode<T>, Color>;

  // Accessor function that returns the pattern color for a tree node
  // If not provided, then background color is used as default.
  readonly patternColorFn: TypedAccessorFn<TreeNode<T>, Color>;

  // Accessor function that returns the fill pattern for a tree node.
  readonly fillPatternFn: TypedAccessorFn<TreeNode<T>, FillPatternType>;

  // Accessor function that returns the stroke width in pixel for a tree node.
  readonly strokeWidthPxFn: TypedAccessorFn<TreeNode<T>, number>;

  // Accessor function that returns the label for a tree node.
  readonly labelFn: TypedAccessorFn<TreeNode<T>, string>;

  // Accessor function that returns the style spec for a tree node label.
  readonly labelStyleFn: TypedAccessorFn<TreeNode<T>, TextStyleSpec>;

  // [attributes] stores additional key-value pairs of attributes this tree is
  // associated with (e.g. rendererIdKey to renderer).
  readonly attributes = new TreeAttributes();

  constructor({
    id,
    root,
    domainFn,
    measureFn,
    colorFn,
    fillColorFn,
    patternColorFn,
    fillPatternFn,
    strokeWidthPxFn,
    labelFn,
    labelStyleFn,
  }: {
    id: any,
    root: TreeNode<T>,
    domainFn: TypedAccessorFn<T, D>,
    measureFn: TypedAccessorFn<T, number>,
    colorFn?: TypedAccessorFn<T, Color>,
    fillColorFn?: TypedAccessorFn<T, Color>,
    patternColorFn?: TypedAccessorFn<T, Color>,
    fillPatternFn?: TypedAccessorFn<T, FillPatternType>,
    strokeWidthPxFn?: TypedAccessorFn<T, number>,
    labelFn?: TypedAccessorFn<T, string>,
    labelStyleFn?: TypedAccessorFn<T, TextStyleSpec>,
  }) {
    this.id = id;
    this.root = root;
    this.domainFn = _castFrom(domainFn);
    this.measureFn = _castFrom(measureFn);
    this.colorFn = _castFrom(colorFn);
    this.fillColorFn = _castFrom(fillColorFn);
    this.patternColorFn = _castFrom(patternColorFn);
    this.fillPatternFn = _castFrom(fillPatternFn);
    this.strokeWidthPxFn = _castFrom(strokeWidthPxFn);
    this.labelFn = _castFrom(labelFn);
    this.labelStyleFn = _castFrom(labelStyleFn);
  }

  // Creates a [Series] that contains all [TreeNode]s traversing from the
  // [root] of this tree.
  //
  // Considers the following tree:
  // ```
  //       A
  //     / | \
  //    B  C  D      --->    [A, B, C, D, E, F]
  //         / \
  //        E   F
  // ```
  // This method traverses from root node "A" in breadth-first order and
  // adds all its children to a list. The order of [TreeNode]s in the list
  // is based on the insertion order to children of a particular node.
  // All [TreeNode]s are accessible through [Series].data.
  toSeries = () => {
    const data: Array<TreeNode<T>> = [];
    this.root.visit(data.push);

    const rst = new Series({
      id: this.id,
      data,
      domainFn: this.domainFn,
      measureFn: this.measureFn,
      colorFn: this.colorFn,
      fillColorFn: this.fillColorFn,
      fillPatternFn: this.fillPatternFn,
      patternColorFn: this.patternColorFn,
      strokeWidthPxFn: this.strokeWidthPxFn,
      labelAccessorFn: this.labelFn,
      insideLabelStyleAccessorFn: this.labelStyleFn,
    })
    rst.attributes.mergeFrom(this.attributes);
    return rst;
  };

  setAttribute = <R>(key: AttributeKey<R>, value: R) => {
    this.attributes.setAttr(key, value);
  };

  getAttribute = <R>(key: AttributeKey<R>) =>
    this.attributes.getAttr<R>(key);
}

export class TreeNode<T> {
  // Associated data this node stores.
  readonly data: T;

  readonly _children: Array<TreeNode<T>> = [];

  _depth: number = 0;

  constructor(data: T) {
    this.data = data;
  }

  // Distance between this node and the root node.
  get depth() {
    return this._depth;
  }

  set depth(val: number) {
    this._depth = val;
  }

  // List of child nodes.
  get children() {
    return this._children;
  }

  // Whether or not this node has any children.
  get hasChildren() {
    return this._children.length !== 0;
  }

  // Adds a single child to this node.
  addChild = (child: TreeNode<T>) => {
    const delta = this.depth - child.depth + 1;
    if (delta !== 0) {
      child.visit((node: TreeNode<T>) => {
        node.depth += delta;
      });
    }
    this._children.push(child);
  };

  // Adds a list of children to this node.
  addChildren = (newChildren: Array<TreeNode<T>>) => {
    newChildren.forEach(this.addChild);
  };

  // Applies the function [f] to all child nodes rooted from this node in
  // breadth first order.
  visit = (f: (node: TreeNode<T>) => void) => {
    const queue: Array<TreeNode<T>> = [this];

    while (queue.length !== 0) {
      const node = queue.shift();
      f(node);
      queue.push(...node.children);
    }
  };
}

// A registry that stores key-value pairs of attributes.
export class TreeAttributes extends TypedRegistry {}

const _castFrom = <T, R>(f: TypedAccessorFn<T, R>): TypedAccessorFn<TreeNode<T>, R> =>
  (f == null
    ? null
    : (node: TreeNode<T>, index: number) => f(node.data, index));
