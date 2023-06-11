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

  function addChild(cType, indexes) {
    setComponentsTree(componentsTree.addChild(cType, indexes));
  }

  // console.log(componentsTree);

  return html`<div tw="bg-gray-100 h-screen flex flex-col">
    <button
      tw="fixed bottom-0 right-0 bg-red-400 hover:bg-red-300 text-white px-2 py-1 rounded-md mr-1 mb-1"
      onClick=${() => resetPersistentState()}
    >
      Reset state
    </button>
    <div tw="flex flex-grow">
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
    </div>
    <div tw="text-center py-2 bg-gray-700 text-white text-xs">
      <a tw="opacity-80 cursor-pointer">
        ${"Crafted with ❤️ by "}
        <a
          tw="text-blue-300 underline hover:text-blue-200"
          href="https://ezequielschwartzman.org"
          >Ezequiel</a
        >${" find "}
        <a
          tw="text-blue-300 underline hover:text-blue-200"
          href="https://github.com/Zequez/component-editor"
          >source code on Github</a
        >
      </a>
    </div>
  </div>`;

  function renderComponentControls(comp, indexes) {
    const baseComponent = ComponentTree.baseComponents[comp.cType];
    const slotsLeft = baseComponent.childrenSlots - comp.children.length;

    return html`<div>
      <div tw="flex space-x-1 h-8">
        <button
          tw="bg-red-400 hover:bg-red-500 w-8 rounded-md px-1 py-0.5 text-white pb-1"
          onClick=${() => removeComponent(indexes)}
        >
          ×
        </button>
        <div
          tw="bg-green-400 rounded-md px-1 py-0.5 w-16 text-white uppercase text-xs flex items-center justify-center"
        >
          ${comp.cType}
        </div>

        ${slotsLeft > 0
          ? html`<button
                tw="bg-yellow-400 hover:bg-yellow-500 w-8 rounded-md px-1 py-0.5 text-white scale-x-[-1]"
                onClick=${() => addChild("box", indexes)}
              >
                ↵
              </button>
              <button
                tw="bg-blue-400 hover:bg-blue-500 w-8 rounded-md px-1 py-0.5 text-white text-xs"
                onClick=${() => addChild("text", indexes)}
              >
                Aa
              </button>`
          : null}
        <div tw="flex-grow flex ml-1">
          ${ComponentTree.baseComponents[comp.cType].renderControl(
            comp.props,
            (newProps) => handleComponentPropsUpdate(newProps, indexes)
          )}
        </div>
      </div>

      ${comp.children.length
        ? html`<div tw="pl-8 space-y-2 pt-2">
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
