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

  addChild(cType, depth = []) {
    const childIndex = depth[0];

    const newChildren =
      childIndex == null
        ? [...this.children, ComponentTree.build(cType)]
        : [
            ...this.children.slice(0, childIndex),
            this.children[childIndex].addChild(cType, depth.slice(1)),
            ...this.children.slice(childIndex + 1),
          ];

    return new ComponentTree(this.cType, this.props, newChildren);
  }

  static fromObject(obj) {
    return new ComponentTree(obj.cType, obj.props, obj.children);
  }

  static build(cType = "box") {
    return new ComponentTree(cType, {}, []);
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
          tw="bg-white rounded-md text-sm px-1 py-0.5 h-full border border-gray-300 w-full"
          placeholder="Style directives"
          value=${props.tw}
          onInput=${(ev) => setProps({ tw: ev.target.value })}
        />
      </div>`,
      childrenSlots: Infinity,
    },
    text: {
      render: ({ text, tw }) => html`<span tw=${tw}>${text}</span>`,
      renderControl: (props, setProps) => {
        return html`<input
            type="text"
            tw="bg-white rounded-md text-sm px-1 py-0.5 mr-1 h-full border border-gray-300 w-full"
            placeholder="Style directives"
            value=${props.tw}
            onInput=${(ev) => setProps({ ...props, tw: ev.target.value })}
          /><input
            type="text"
            tw="bg-white rounded-md text-sm px-1 py-0.5 border border-gray-300 w-full"
            placeholder="Text content"
            value=${props.text}
            onInput=${(ev) => setProps({ ...props, text: ev.target.value })}
          />`;
      },
      childrenSlots: 0,
    },
  };

  static reusableComponents = {};

  static demo = () =>
    ComponentTree.fromObject({
      cType: "box",
      props: { tw: "p-8" },
      children: [
        {
          cType: "box",
          props: {
            tw: "p-4 h-20 flex items-center justify-center bg-green-400 rounded-lg shadow-md hover:bg-green-300",
          },
          children: [
            {
              cType: "text",
              props: {
                text: "Component editor",
                tw: "text-3xl text-white hover:text-4xl",
              },
              children: [],
            },
          ],
        },
        {
          cType: "box",
          props: {
            tw: "flex items-stretch h-24 overflow-hidden rounded-md mt-4 shadow-sm",
          },
          children: [
            { cType: "box", props: { tw: "flex-1 bg-red-400" }, children: [] },
            {
              cType: "box",
              props: { tw: "flex-1 bg-yellow-400" },
              children: [],
            },
            {
              cType: "box",
              props: { tw: "flex-1 bg-green-400" },
              children: [],
            },
            { cType: "box", props: { tw: "flex-1 bg-blue-400" }, children: [] },
            {
              cType: "box",
              props: { tw: "flex-1 bg-purple-400" },
              children: [],
            },
          ],
        },
        { cType: "box", props: {}, children: [] },
        { cType: "box", props: {}, children: [] },
      ],
    });
}
