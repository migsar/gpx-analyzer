import { join } from "https://deno.land/std@0.108.0/path/mod.ts";

import GPXAnalyzer from "./GPXAnalyzer.ts";

const [fileName] = Deno.args;
const filePath = join(Deno.cwd(), fileName);
// ToDo: Should we use streams?
const fileContent = await Deno.readTextFile(filePath);

const gpxAnalyzer = new GPXAnalyzer();

gpxAnalyzer.analyze(fileContent);
