import { html } from "../external.js";

export default class ComponentTree {
  constructor(cType, props, children) {
    this.cType = cType;
    this.props = props;
    this.children = children.map(ComponentTree.fromObject);
  }

  updateProps(props, depth = []) {
    const childIndex = depth[0];

    console.log("Updating props", props, depth);

    if (childIndex == null) {
      return new ComponentTree(this.cType, props, this.children);
    } else {
      const newChildren = [
        ...this.children.slice(0, childIndex),
        this.children[childIndex].updateProps(props, depth.slice(1)),
        ...this.children.slice(childIndex + 1),
      ];
      return new ComponentTree(this.cType, this.props, newChildren);
    }
  }

  deleteChild(depth = []) {
    const childIndex = depth[0];

    if (childIndex == null) {
      return this;
    } else {
      const head = this.children.slice(0, childIndex);
      const tail = this.children.slice(childIndex + 1);
      const middle =
        depth.length === 1
          ? []
          : [this.children[childIndex].deleteChild(depth.slice(1))];

      return new ComponentTree(this.cType, this.props, [
        ...head,
        ...middle,
        ...tail,
      ]);
    }
  }

  addChild(depth = []) {
    const childIndex = depth[0];

    const newChildren =
      childIndex == null
        ? [...this.children, ComponentTree.build()]
        : [
            ...this.children.slice(0, childIndex),
            this.children[childIndex].addChild(depth.slice(1)),
            ...this.children.slice(childIndex + 1),
          ];

    return new ComponentTree(this.cType, this.props, newChildren);
  }

  static fromObject(obj) {
    return new ComponentTree(obj.cType, obj.props, obj.children);
  }

  static build() {
    return new ComponentTree("box", {}, []);
  }

  static render(comp) {
    return ComponentTree.baseComponents[comp.cType].render(
      comp.props,
      comp.children
    );
  }

  static baseComponents = {
    box: {
      render: (props, children) =>
        html`<div tw=${props.tw}>${children.map(ComponentTree.render)}</div>`,
      renderControl: (props, setProps) => html`<div tw="flex-grow">
        <input
          type="text"
          tw="bg-white rounded-md text-sm px-1 py-0.5 border border-gray-300 w-full"
          placeholder="Style directives"
          value=${props.tw}
          onInput=${(ev) => setProps({ tw: ev.target.value })}
        />
      </div>`,
    },
    text: {
      render: ({ text }) => html`<span>${text}</span>`,
    },
  };

  static reusableComponents = {};
}
