// #if _DEBUG
export class BlockInfo {
  readonly sourceFile: string;
  readonly rangeInFile?: IIdxRange;
  readonly sourceMap?: PpSourceMap;

  constructor(sourceFile?: string, rangeInFile?: IIdxRange, sourceMap?: PpSourceMap) {
    this.sourceFile = sourceFile ?? "__main__";
    this.rangeInFile = rangeInFile;
    this.sourceMap = sourceMap;
  }
}

export class MapRange {
  sourceLoc: { block: BlockInfo; rangeInBlock: IIdxRange };
  generatedLoc: { start: number; end: number };

  constructor(sourceBlock: BlockInfo, rangeInBlock: IIdxRange, generatedLoc: { start: number; end: number }) {
    this.sourceLoc = { block: sourceBlock, rangeInBlock };
    this.generatedLoc = generatedLoc;
  }

  getSourceIndex(generatedIdx: number) {
    const { block, rangeInBlock } = this.sourceLoc;
    if (block.sourceMap) {
      if (block.sourceFile !== "__main__") return block.sourceMap.map(generatedIdx - this.generatedLoc.start);
      else if (rangeInBlock) {
        return { sourceFile: block.sourceFile, index: (block.rangeInFile?.start ?? 0) + rangeInBlock.start };
      }
    }

    return {
      index: generatedIdx - this.generatedLoc.start + rangeInBlock.start + (block.rangeInFile?.start ?? 0),
      sourceFile: this.sourceLoc.block.sourceFile
    };
  }
}

export default class PpSourceMap {
  readonly mapRanges: MapRange[] = [];

  static rangeContains(range: MapRange["generatedLoc"], index: number) {
    return range.start <= index && range.end > index;
  }

  addMapRange(mapRange: MapRange) {
    this.mapRanges.push(mapRange);
  }

  /**
   * @returns index
   */
  map(index: number): { sourceFile: string; index: number } {
    let curRange: MapRange | undefined;
    for (const range of this.mapRanges) {
      const { generatedLoc } = range;
      if (PpSourceMap.rangeContains(generatedLoc, index)) {
        return range.getSourceIndex(index);
      } else if (range.generatedLoc.start < index) {
        curRange = range;
        continue;
      } else {
        break;
      }
    }
    if (!curRange) return { sourceFile: "__main__", index };
    return {
      index: index - curRange.generatedLoc.end + curRange.sourceLoc.rangeInBlock.end,
      sourceFile: curRange.sourceLoc.block.sourceFile
    };
  }
}
// #endif