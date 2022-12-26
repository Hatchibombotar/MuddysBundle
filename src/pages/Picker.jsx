import logo from '../logo.svg';
import styles from '../App.module.css';

import JSZip from 'jszip';
import JSZipUtils from "jszip-utils"
import { saveAs } from 'file-saver'

import data from "../data/modules.json"
import { createSignal } from 'solid-js';

import { useNavigate } from "@solidjs/router"


import Socials from '../components/Socials';

const [selectedModules, setSelectedModules] = createSignal([
  "baseFiles"
])

const removeModule = (module) => {
  setSelectedModules(selectedModules().filter((mod) => mod != module))
}
const addModule = (module) => {
  setSelectedModules([...selectedModules(), module])
}

const [previewedModule, setPreview] = createSignal("default")

function PackPicker() {
  const navigate = useNavigate();

  return (
    <main>
      <div class={styles.sidebar}>
        <button
          class={styles.buttonPrimary}
          type="button"
          onclick={download}
        >Download</button>

        <button
          type="button"
          onclick={() => navigate("/credits")}
        >Credits</button>
        <img class={styles.preview} src={`preview/${previewedModule()}.png`} width={1920} height={1080} />

        <Socials />

      </div>
      <div class={styles.picker}>
        <For each={data}>{(category) =>
          <>
            <div class={styles.categoryHeader}>
              <p>{category.name}</p>
            </div>
            <div class={styles.moduleList}>
              <For each={category.modules}>{(module) => {
                const disabled = () => selectedModules().some((selectedModule) => module.incompatibilities?.includes(selectedModule))
                return <div
                  class={`
                  ${styles.module}
                  ${selectedModules().includes(module.id) ? styles.moduleSelected : undefined}
                  ${disabled() ? styles.moduleIncompatible : undefined}`
                  }
                  onclick={() => {
                    if (disabled()) return
                    if (selectedModules().includes(module.id)) {
                      removeModule(module.id)
                    } else {
                      addModule(module.id)
                    }
                  }}
                  onmouseover={() => setPreview(module.id)}
                  onmouseout={() => setPreview("default")}
                >
                  <h3>{module.label}</h3>
                  <img src={`icons/${module.id}.png`} />
                  <p>{module.description}</p>
                </div>
              }}</For>
            </div>
          </>
        }</For>
      </div>

    </main>

  );
}

async function download() {
  const zip = new JSZip();

  for (const module of selectedModules()) {
    const moduleRoot = `packs/${module}`
    const fetchContent = await fetch(`${moduleRoot}/contents.json`)

    if (fetchContent.status != 200) {
      console.error(`Unable to fetch contents.json file for ${module}`)
      return
    }
    const contents = await fetchContent.json()

    for (const file of contents) {
      const extention = file.split(".")[1]
      if (["json", "txt", "mcmeta"].includes(extention)) {
        const fileContent = await getTextFile(`${moduleRoot}/${file}`)
        zip.file(file, fileContent);
      } else {
        const fileContent = await getBinaryFile(`${moduleRoot}/${file}`)
        zip.file(file, fileContent, { binary: true });
      }
    }
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    // see FileSaver.js
    saveAs(content, "example.zip");
  });
}

async function getTextFile(path) {
  const fetchFile = await fetch(path)
  return fetchFile.text()
}

async function getBinaryFile(path) {
  return new JSZip.external.Promise(function (resolve, reject) {
    JSZipUtils.getBinaryContent(path, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
}

export default PackPicker;
