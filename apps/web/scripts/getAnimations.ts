// A custom https://www.mixamo.com/ animation loader for GLTF

// first we look at Downloads for new .fbx files
// then we use the FBX2GLTF converter (https://github.com/godotengine/FBX2glTF) to convert them to .gltf

import * as fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationClip } from "three";

const DOWNLOADS_PATH = "/Users/jamielegg/Downloads/";
const OUTPUT_PATH = "./apps/web/public/gltf/";

interface Animation {
  name: string;
  channels: {
    sampler: number;
    target: {
      node: number;
      path: string;
    };
  };
  samplers: {
    input: number;
    interpolation: string;
    output: number;
  }[];
}

interface CharGLTF {
  animations: Animation[];
  buffers: {
    uri: string;
    byteLength: number;
    name: string;
  }[];
  bufferViews: {
    buffer: number;
    byteOffset: number;
    byteLength: number;
    target: number;
  }[];
}

async function main(): Promise<void> {
  const newGLTFs = (await getNewGLTFs()) as unknown as CharGLTF[];

  const existingGLTF = (await getExistingGLTF()) as unknown as CharGLTF;

  // first we need to extract the buffers from the new gltfs
  // and index them appropriately
  console.log(existingGLTF.buffers);

  // for each file we need to convert it to a gltf, examine the gltf,
  // extract the buffer, rename the animation, and then add it to a list of new animations
  // to compare against the existing animations
  const newAnimations: Animation[] = [];
  const newBuffers: {
    uri: string;
    byteLength: number;
    name: string;
  }[] = [];


  const existingAnimations = existingGLTF.animations as unknown as Animation[];
    // Remove duplicates and update animations
  const updatedAnimations = [];
  for (const newAnimation of newAnimations) {
    if (!existingAnimations.some(ea => ea.name === newAnimation.name)) {
      updatedAnimations.push(newAnimation);
    }
  }

  existingGLTF.animations = [...existingAnimations, ...updatedAnimations];
  existingGLTF.buffers = [...existingGLTF.buffers, ...newBuffers];

}

async function getNewGLTFs(): Promise<GLTF[]> {
  const gltfs: GLTF[] = [];
  const directory = await fs.opendir(DOWNLOADS_PATH);
  for await (const file of directory) {
    if (file.name.endsWith(".fbx")) {
      const gltf = await convertFBXtoGLTF(file.name);
      // rename the animation to the file name
      if (gltf.animations[0]) {
        gltf.animations[0].name = file.name
          .toLowerCase()
          .replace(" ", "_")
          .replace(".fbx", "");
      }
      gltfs.push(gltf);
    }
  }

  return gltfs;
}

async function convertFBXtoGLTF(fileName: string): Promise<GLTF> {
  //! I opted to move fbx2gltf to my path
  fileName = fileName.replace(/\s/g, "\\ ");
  const command = `fbx2gltf ${DOWNLOADS_PATH}${fileName} -o ${OUTPUT_PATH}${fileName.toLowerCase().replace(".fbx", "")}`;
  await promisify(exec)(command);
  fileName = fileName.replace(/\\ /g, " ").replace(".fbx", "");
  const fullPath = `${fileName}_out/${fileName}.gltf`;
  const gltf = await getGLTF(fullPath);
  return gltf;
}

async function getExistingGLTF(): Promise<GLTF> {
  return await getGLTF("./apps/web/public/gltf/char.gltf");
}

async function getGLTF(fullPath: string): Promise<GLTF> {
  return JSON.parse(await fs.readFile(fullPath, "utf-8")) as GLTF;
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.error(err);
  });
