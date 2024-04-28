import * as fs from "fs/promises";
import JSZip from "jszip";

export interface TelegramData {
    id: number;
    username: string;
  }

  export async function extractDataFromZipFile(zipPath: string): Promise<TelegramData> {
    const buffer = await fs.readFile(zipPath);
    const zip = new JSZip();
    await zip.loadAsync(buffer);
    let jsonData;

    // Iterate over each file within the ZIP
    const files = Object.values(zip.files);
    for (const file of files) {
        if (!file.dir && file.name.includes("data")) {
            // If the file is called "data", read its content
            const contentData = await file.async("string");
            // Convert the content into a JSON object
            jsonData = JSON.parse(contentData);
        }
    }

    // If no "data" file was found in the ZIP, throw an error
    if (!jsonData) {
        throw new Error("No data file was found in the zip.");
    }

    // Return the JSON object
    return jsonData;
}
