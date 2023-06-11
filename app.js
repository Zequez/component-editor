import {
  html,
  tw,
  render,
  useState,
  useEffect,
  useRef,
  z,
} from "./external.js";
import { usePersistentState } from "./hooks.js";

const baseComponents = {
  box: {
    render: (props, children) => html`<div tw=${props.tw}>Box</div>`,
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

// const ComponentDefinitionSchema = z.object({
//   componentType: z.string(),
//   props: z.object({})
// });

function App(props) {
  const [reusableComponents, setReusableComponents] = usePersistentState(
    "reusableComponents",
    baseComponents
  );
  const [components, setComponents] = usePersistentState("components", []);

  function addComponent(componentType) {
    const newComponentDefinition = {
      cType: componentType,
      props: {},
      children: [],
    };
    setComponents([...components, newComponentDefinition]);
  }

  function handleComponentPropsUpdate(index, newProps) {
    const newComponents = [...components];
    newComponents[index].props = newProps;
    setComponents(newComponents);
    console.log("Changing component props", index, newProps, newComponents);
  }

  function removeComponent(index) {
    setComponents([
      ...components.slice(0, index),
      ...components.slice(index + 1),
    ]);
  }

  return html`<div tw="bg-gray-700 h-screen flex">
    <div tw="bg-gray-100 border-r-2 border-gray-200 w-1/2 p-4">
      <div
        tw="text-center mb-2 uppercase tracking-wide font-bold text-gray-600"
      >
        Page Preview
      </div>
      <div tw="bg-white shadow-md border border-gray-300">
        ${components.map(({ cType, props, children, name }) =>
          reusableComponents[cType].render(props, children)
        )}
      </div>
    </div>
    <div tw="bg-gray-100 p-4 w-1/2">
      <div tw="space-y-2">
        ${components.map(
          ({ cType, props, children }, i) =>
            html`<div tw="flex">
              <div
                tw="bg-green-400 rounded-md px-1 py-0.5 text-white uppercase mr-1 text-sm"
              >
                ${cType}
              </div>
              <button
                tw="bg-red-400 hover:bg-red-500 w-6 rounded-md px-1 py-0.5 mr-2 text-white"
                onClick=${() => removeComponent(i)}
              >
                ×
              </button>
              <div tw="flex-grow flex">
                ${reusableComponents[cType].renderControl(props, (newProps) =>
                  handleComponentPropsUpdate(i, newProps)
                )}
              </div>
            </div>`
        )}
      </div>
      <div tw="mt-4 space-x-2">
        ${Object.keys(reusableComponents).map((componentType) =>
          AddComponentButton(componentType, addComponent)
        )}
      </div>
    </div>
  </div>`;
}

function AddComponentButton(componentType, action) {
  return html`<button
    tw="px-2 py-1 bg-blue-500 rounded-md text-white hover:bg-blue-400"
    onClick=${() => action(componentType)}
  >
    Add ${componentType}
  </button>`;
}

render(html`<${App} />`, document.getElementById("app"));
