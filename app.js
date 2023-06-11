import {
  html,
  tw,
  render,
  useState,
  useEffect,
  useRef,
  z,
  imm,
} from "./external.js";
import { usePersistentState } from "./hooks.js";
import ComponentTree from "./lib/ComponentTree.js";

// const ComponentDefinitionSchema = z.object({
//   componentType: z.string(),
//   props: z.object({})
// });

function App(props) {
  // const [reusableComponents, setReusableComponents] = usePersistentState(
  //   "reusableComponents",
  //   ComponentbaseComponents
  // );
  const [componentsTree, setComponentsTree] = usePersistentState(
    "components_tree",
    () => ComponentTree.build(),
    (v) => v,
    ComponentTree.fromObject
  );

  const [components, setComponents] = usePersistentState("components", []);

  function resetPersistentState() {
    setComponents([]);
    setComponentsTree(ComponentTree.build());
    // setReusableComponents(baseComponents);
  }

  function addComponent(componentType) {
    const newComponentDefinition = {
      cType: componentType,
      props: {},
      children: [],
    };
    setComponents([...components, newComponentDefinition]);
  }

  function handleComponentPropsUpdate(newProps, indexes) {
    setComponentsTree(componentsTree.updateProps(newProps, indexes));
  }

  function removeComponent(indexes) {
    setComponentsTree(componentsTree.deleteChild(indexes));
  }

  function addChild(indexes) {
    setComponentsTree(componentsTree.addChild(indexes));
  }

  // console.log(componentsTree);

  return html`<div tw="bg-gray-700 h-screen flex">
    <div tw="bg-gray-100 border-r-2 border-gray-200 w-1/2 p-4 flex flex-col">
      <div
        tw="text-center mb-2 uppercase tracking-wide font-bold text-gray-600"
      >
        Page Preview
      </div>
      <div tw="bg-white shadow-md border border-gray-300 flex-grow">
        ${ComponentTree.render(componentsTree)}
      </div>
    </div>
    <div tw="bg-gray-100 p-4 w-1/2">
      <div>${renderComponentControls(componentsTree, [])}</div>
    </div>
  </div>`;

  function renderComponentControls(comp, indexes) {
    return html`<div>
      <button
        tw="fixed bottom-0 right-0 bg-red-400 hover:bg-red-300 text-white px-2 py-1 rounded-md mr-1 mb-1"
        onClick=${() => resetPersistentState()}
      >
        Reset state
      </button>
      <div tw="flex">
        <div
          tw="bg-green-400 rounded-md px-1 py-0.5 text-white uppercase mr-1 text-sm"
        >
          ${comp.cType}
        </div>
        <button
          tw="bg-red-400 hover:bg-red-500 w-6 rounded-md px-1 py-0.5 mr-2 text-white"
          onClick=${() => removeComponent(indexes)}
        >
          ×
        </button>
        <button
          tw="bg-yellow-400 hover:bg-yellow-500 w-6 rounded-md px-1 py-0.5 mr-2 text-white scale-x-[-1]"
          onClick=${() => addChild(indexes)}
        >
          ↵
        </button>
        <div tw="flex-grow flex">
          ${ComponentTree.baseComponents[comp.cType].renderControl(
            comp.props,
            (newProps) => handleComponentPropsUpdate(newProps, indexes)
          )}
        </div>
      </div>

      ${comp.children.length
        ? html`<div tw="pl-4 space-y-2 pt-2">
            ${comp.children.map((comp, i) =>
              renderComponentControls(comp, [...indexes, i])
            )}
          </div>`
        : null}
    </div>`;
  }
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
