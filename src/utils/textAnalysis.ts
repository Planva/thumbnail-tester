export interface TextDetection {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  fontSize: number;
  position: 'top' | 'center' | 'bottom' | 'left' | 'right';
  readability: number;
}

export interface TextAnalysis {
  totalText: string;
  textCount: number;
  averageConfidence: number;
  averageFontSize: number;
  textCoverage: number;
  readabilityScore: number;
  textPositions: string[];
  detections: TextDetection[];
  hasTitle: boolean;
  titleQuality: number;
}

export interface TextComparisonSuggestion {
  type: 'text_size' | 'text_position' | 'text_readability' | 'text_amount' | 'title_quality';
  message: string;
  winner: 'A' | 'B';
  improvement: string;
  score: number;
  details?: string;
}

export async function analyzeTextInImage(file: File): Promise<TextAnalysis> {
  try {
    console.log('Starting Canvas-based text analysis for file:', file.name);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // 设置画布大小
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // 获取图像数据进行分析
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const analysis = analyzeImageForText(imageData, img.width, img.height);
        
        console.log('Canvas-based text analysis completed:', analysis);
        resolve(analysis);
      };
      
      img.onerror = () => {
        console.error('Failed to load image for text analysis');
        resolve(getDefaultAnalysis());
      };
      
      img.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error('Canvas text analysis failed:', error);
    return getDefaultAnalysis();
  }
}

function analyzeImageForText(imageData: ImageData, width: number, height: number): TextAnalysis {
  console.log('Analyzing image for text regions...');
  
  // 检测文字区域的算法
  const textRegions = detectTextRegions(imageData, width, height);
  console.log(`Detected ${textRegions.length} potential text regions`);
  
  // 分析每个文字区域
  const detections: TextDetection[] = textRegions.map((region, index) => ({
    text: `Text Region ${index + 1}`,
    confidence: region.confidence,
    bbox: region.bbox,
    fontSize: region.fontSize,
    position: region.position,
    readability: region.readability
  }));
  
  // 计算整体分析结果
  const analysis = calculateTextAnalysis(detections, width, height);
  
  return analysis;
}

function detectTextRegions(imageData: ImageData, width: number, height: number) {
  const data = imageData.data;
  const regions: any[] = [];
  
  // 边缘检测 - 寻找文字边界
  const edges = detectEdges(data, width, height);
  
  // 连通区域分析 - 找到文字块
  const textBlocks = findConnectedComponents(edges, width, height);
  
  // 过滤和分析文字块
  textBlocks.forEach((block, index) => {
    if (isLikelyTextBlock(block, width, height)) {
      const region = analyzeTextBlock(block, width, height, index);
      regions.push(region);
    }
  });
  
  console.log(`Found ${regions.length} text-like regions`);
  return regions;
}

function detectEdges(data: Uint8ClampedArray, width: number, height: number): number[] {
  const edges = new Array(width * height).fill(0);
  const threshold = 50;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      
      // 计算灰度值
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      
      // Sobel边缘检测
      const gx = 
        -1 * getGray(data, x-1, y-1, width) + 1 * getGray(data, x+1, y-1, width) +
        -2 * getGray(data, x-1, y, width) + 2 * getGray(data, x+1, y, width) +
        -1 * getGray(data, x-1, y+1, width) + 1 * getGray(data, x+1, y+1, width);
      
      const gy = 
        -1 * getGray(data, x-1, y-1, width) + -2 * getGray(data, x, y-1, width) + -1 * getGray(data, x+1, y-1, width) +
        1 * getGray(data, x-1, y+1, width) + 2 * getGray(data, x, y+1, width) + 1 * getGray(data, x+1, y+1, width);
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edges[y * width + x] = magnitude > threshold ? 1 : 0;
    }
  }
  
  return edges;
}

function getGray(data: Uint8ClampedArray, x: number, y: number, width: number): number {
  const i = (y * width + x) * 4;
  return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
}

function findConnectedComponents(edges: number[], width: number, height: number) {
  const visited = new Array(width * height).fill(false);
  const components: any[] = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (edges[index] === 1 && !visited[index]) {
        const component = floodFill(edges, visited, x, y, width, height);
        if (component.length > 10) { // 最小区域大小
          components.push(component);
        }
      }
    }
  }
  
  return components;
}

function floodFill(edges: number[], visited: boolean[], startX: number, startY: number, width: number, height: number) {
  const stack = [{x: startX, y: startY}];
  const component: {x: number, y: number}[] = [];
  
  while (stack.length > 0) {
    const {x, y} = stack.pop()!;
    const index = y * width + x;
    
    if (x < 0 || x >= width || y < 0 || y >= height || visited[index] || edges[index] === 0) {
      continue;
    }
    
    visited[index] = true;
    component.push({x, y});
    
    // 8连通
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        stack.push({x: x + dx, y: y + dy});
      }
    }
  }
  
  return component;
}

function isLikelyTextBlock(component: {x: number, y: number}[], width: number, height: number): boolean {
  if (component.length < 20) return false;
  
  // 计算边界框
  let minX = component[0].x;
  let maxX = component[0].x;
  let minY = component[0].y;
  let maxY = component[0].y;
  
  for (const point of component) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }
  
  const blockWidth = maxX - minX;
  const blockHeight = maxY - minY;
  
  // 文字块的宽高比通常在合理范围内
  const aspectRatio = blockWidth / blockHeight;
  
  // 文字块不应该太小或太大
  const area = blockWidth * blockHeight;
  const imageArea = width * height;
  const areaRatio = area / imageArea;
  
  return aspectRatio > 0.5 && aspectRatio < 10 && areaRatio > 0.001 && areaRatio < 0.3;
}

function analyzeTextBlock(component: {x: number, y: number}[], width: number, height: number, index: number) {
  let minX = component[0].x;
  let maxX = component[0].x;
  let minY = component[0].y;
  let maxY = component[0].y;
  
  for (const point of component) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }
  
  const blockWidth = maxX - minX;
  const blockHeight = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  // 计算字体大小（相对于图像高度的百分比）
  const fontSize = (blockHeight / height) * 100;
  
  // 确定位置
  const relativeX = centerX / width;
  const relativeY = centerY / height;
  let position: 'top' | 'center' | 'bottom' | 'left' | 'right';
  
  if (relativeY < 0.33) position = 'top';
  else if (relativeY > 0.67) position = 'bottom';
  else if (relativeX < 0.33) position = 'left';
  else if (relativeX > 0.67) position = 'right';
  else position = 'center';
  
  // 计算可读性分数
  const density = component.length / (blockWidth * blockHeight);
  const sizeScore = Math.min(100, fontSize * 10);
  const densityScore = Math.min(100, density * 1000);
  const readability = (sizeScore + densityScore) / 2;
  
  // 基于大小和位置的置信度
  let confidence = 60; // 基础置信度
  if (fontSize > 3) confidence += 20; // 大字体加分
  if (position === 'top' || position === 'center') confidence += 10; // 好位置加分
  if (blockWidth > blockHeight * 2) confidence += 10; // 横向文字加分
  
  return {
    bbox: { x0: minX, y0: minY, x1: maxX, y1: maxY },
    fontSize,
    position,
    readability,
    confidence: Math.min(100, confidence),
    area: blockWidth * blockHeight
  };
}

function calculateTextAnalysis(detections: TextDetection[], width: number, height: number): TextAnalysis {
  if (detections.length === 0) {
    return getDefaultAnalysis();
  }
  
  // 计算平均值
  const averageConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length;
  const averageFontSize = detections.reduce((sum, d) => sum + d.fontSize, 0) / detections.length;
  const averageReadability = detections.reduce((sum, d) => sum + d.readability, 0) / detections.length;
  
  // 计算文字覆盖面积
  let totalTextArea = 0;
  detections.forEach(d => {
    const w = d.bbox.x1 - d.bbox.x0;
    const h = d.bbox.y1 - d.bbox.y0;
    totalTextArea += w * h;
  });
  const textCoverage = (totalTextArea / (width * height)) * 100;
  
  // 分析文字位置分布
  const positions = [...new Set(detections.map(d => d.position))];
  
  // 检测是否有标题（大字体且在上方或中心）
  const hasTitle = detections.some(d => 
    d.fontSize > 4 && 
    d.confidence > 70 && 
    (d.position === 'top' || d.position === 'center')
  );
  
  // 计算标题质量
  const titleQuality = hasTitle ? calculateTitleQuality(detections) : 0;
  
  // 生成模拟文字内容
  const totalText = detections.map(d => d.text).join(' ');
  
  return {
    totalText,
    textCount: detections.length,
    averageConfidence: Math.round(averageConfidence),
    averageFontSize: Math.round(averageFontSize * 10) / 10,
    textCoverage: Math.round(textCoverage * 100) / 100,
    readabilityScore: Math.round(averageReadability),
    textPositions: positions,
    detections,
    hasTitle,
    titleQuality: Math.round(titleQuality)
  };
}

function calculateTitleQuality(detections: TextDetection[]): number {
  // 找到最大的文字作为标题
  const titleCandidate = detections.reduce((max, current) => 
    current.fontSize > max.fontSize ? current : max
  );
  
  let quality = 0;
  
  // 字体大小评分 (40%)
  quality += Math.min(40, titleCandidate.fontSize * 8);
  
  // 位置评分 (30%)
  if (titleCandidate.position === 'top' || titleCandidate.position === 'center') {
    quality += 30;
  } else {
    quality += 15;
  }
  
  // 可读性评分 (30%)
  quality += (titleCandidate.readability / 100) * 30;
  
  return Math.min(100, quality);
}

function getDefaultAnalysis(): TextAnalysis {
  return {
    totalText: '',
    textCount: 0,
    averageConfidence: 0,
    averageFontSize: 0,
    textCoverage: 0,
    readabilityScore: 50,
    textPositions: [],
    detections: [],
    hasTitle: false,
    titleQuality: 0
  };
}

export function generateTextComparisonSuggestions(
  analysisA: TextAnalysis,
  analysisB: TextAnalysis
): TextComparisonSuggestion[] {
  const suggestions: TextComparisonSuggestion[] = [];
  
  // 文字数量对比
  const textCountDiff = Math.abs(analysisA.textCount - analysisB.textCount);
  if (textCountDiff > 0) {
    const winner = analysisB.textCount > analysisA.textCount ? 'B' : 'A';
    const more = winner === 'B' ? analysisB.textCount : analysisA.textCount;
    const less = winner === 'B' ? analysisA.textCount : analysisB.textCount;
    
    suggestions.push({
      type: 'text_amount',
      message: `Version ${winner} has more text regions (${more} vs ${less})`,
      winner,
      improvement: more > 3 ? 'More text can provide context but may clutter the design' : 'Appropriate amount of text for clear communication',
      score: Math.min(textCountDiff * 25, 100),
      details: `Text regions difference: ${textCountDiff}`
    });
  }
  
  // 文字大小对比
  const fontSizeDiff = Math.abs(analysisA.averageFontSize - analysisB.averageFontSize);
  if (fontSizeDiff > 0.5) {
    const winner = analysisB.averageFontSize > analysisA.averageFontSize ? 'B' : 'A';
    const larger = winner === 'B' ? analysisB.averageFontSize : analysisA.averageFontSize;
    const smaller = winner === 'B' ? analysisA.averageFontSize : analysisB.averageFontSize;
    
    suggestions.push({
      type: 'text_size',
      message: `Version ${winner} has larger text (${larger.toFixed(1)}% vs ${smaller.toFixed(1)}% of image height)`,
      winner,
      improvement: 'Larger text is more readable on mobile devices and attracts more attention',
      score: Math.min(fontSizeDiff * 30, 100),
      details: `Font size difference: ${fontSizeDiff.toFixed(1)}%`
    });
  }
  
  // 文字可读性对比
  const readabilityDiff = Math.abs(analysisA.readabilityScore - analysisB.readabilityScore);
  if (readabilityDiff > 10) {
    const winner = analysisB.readabilityScore > analysisA.readabilityScore ? 'B' : 'A';
    const higher = winner === 'B' ? analysisB.readabilityScore : analysisA.readabilityScore;
    const lower = winner === 'B' ? analysisA.readabilityScore : analysisB.readabilityScore;
    
    suggestions.push({
      type: 'text_readability',
      message: `Version ${winner} has better text readability (${higher} vs ${lower} score)`,
      winner,
      improvement: 'Better text readability leads to higher click-through rates',
      score: Math.min(readabilityDiff * 2, 100),
      details: `Readability is based on text size, density, and positioning`
    });
  }
  
  // 标题质量对比
  if (analysisA.hasTitle || analysisB.hasTitle) {
    const titleQualityDiff = Math.abs(analysisA.titleQuality - analysisB.titleQuality);
    if (titleQualityDiff > 15) {
      const winner = analysisB.titleQuality > analysisA.titleQuality ? 'B' : 'A';
      const higher = winner === 'B' ? analysisB.titleQuality : analysisA.titleQuality;
      const lower = winner === 'B' ? analysisA.titleQuality : analysisB.titleQuality;
      
      suggestions.push({
        type: 'title_quality',
        message: `Version ${winner} has better title quality (${higher} vs ${lower} score)`,
        winner,
        improvement: 'High-quality titles with good size and positioning increase engagement',
        score: Math.min(titleQualityDiff * 2, 100),
        details: `Title quality considers size, position, and readability`
      });
    }
  }
  
  // 文字覆盖面积对比
  const coverageDiff = Math.abs(analysisA.textCoverage - analysisB.textCoverage);
  if (coverageDiff > 1) {
    const winner = analysisB.textCoverage > analysisA.textCoverage ? 'B' : 'A';
    const higher = winner === 'B' ? analysisB.textCoverage : analysisA.textCoverage;
    const lower = winner === 'B' ? analysisA.textCoverage : analysisB.textCoverage;
    
    const isOptimal = higher < 20; // 文字覆盖不应该太多
    
    suggestions.push({
      type: 'text_amount',
      message: `Version ${winner} has ${isOptimal ? 'better' : 'more'} text coverage (${higher.toFixed(1)}% vs ${lower.toFixed(1)}%)`,
      winner,
      improvement: isOptimal 
        ? 'Optimal text coverage balances information and visual appeal'
        : 'More text can provide more context, but may clutter the design',
      score: Math.min(coverageDiff * 15, 100),
      details: `Text coverage: ${coverageDiff.toFixed(1)}% difference`
    });
  }
  
  // 文字位置分析
  const positionsA = analysisA.textPositions;
  const positionsB = analysisB.textPositions;
  
  if (positionsA.length !== positionsB.length || !positionsA.every(p => positionsB.includes(p))) {
    const hasTopA = positionsA.includes('top');
    const hasTopB = positionsB.includes('top');
    
    if (hasTopA !== hasTopB) {
      const winner = hasTopB ? 'B' : 'A';
      suggestions.push({
        type: 'text_position',
        message: `Version ${winner} has text in the top area, which is more visible`,
        winner,
        improvement: 'Top-positioned text is more likely to be seen first by viewers',
        score: 60,
        details: 'Text positioning affects visual hierarchy and attention flow'
      });
    }
  }
  
  return suggestions.sort((a, b) => b.score - a.score);
}

// 清理资源 - 现在不需要清理OCR worker
export async function cleanupOCR() {
  // Canvas-based analysis doesn't need cleanup
  console.log('Canvas-based text analysis cleanup completed');
}