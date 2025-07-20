export interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks?: {
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
    nose: { x: number; y: number };
    mouth: { x: number; y: number };
  };
  expressions?: {
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
    neutral: number;
  };
  age?: number;
  gender?: 'male' | 'female';
  genderProbability?: number;
}

export interface FaceAnalysis {
  averageFaceSize: number;
  personCoverage: number;
  dominantExpression: string;
  hasCloseUpFace: boolean;
  facePositions: string[];
  averageAge?: number;
}

export interface FaceComparisonSuggestion {
  type: 'person_coverage' | 'face_size' | 'face_expression' | 'face_position' | 'face_age';
  message: string;
  winner: 'A' | 'B';
  improvement: string;
  score: number;
  details?: string;
}

export async function detectFacesInImage(file: File): Promise<FaceAnalysis> {
  try {
    console.log('Starting person coverage analysis for file:', file.name);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          console.log('Image loaded, analyzing for person regions...');
          
          // 创建canvas进行图像分析
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // 调整尺寸以提高性能
          const maxSize = 400;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // 使用图像分析检测人物区域
          const personRegions = detectPersonRegions(imageData, canvas.width, canvas.height);
          console.log(`Detection found ${personRegions.length} potential person regions`);
          
          // 分析检测结果
          const analysis = analyzePersonData(personRegions, canvas.width, canvas.height);
          console.log('Person coverage analysis completed:', analysis);
          
          resolve(analysis);
        } catch (error) {
          console.error('Person coverage analysis failed:', error);
          resolve(getDefaultPersonAnalysis());
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load image for person analysis');
        resolve(getDefaultPersonAnalysis());
      };
      
      img.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error('Person analysis initialization failed:', error);
    return getDefaultPersonAnalysis();
  }
}

function detectPersonRegions(imageData: ImageData, width: number, height: number): any[] {
  const data = imageData.data;
  const regions: any[] = [];
  
  // 检测人物区域 - 寻找肤色和人物轮廓
  const edges = detectEdges(data, width, height);
  
  // 连通区域分析 - 找到潜在人物区域
  const personBlocks = findConnectedComponents(edges, width, height);
  
  // 肤色区域检测 - 增强人物检测
  const skinRegions = detectSkinRegions(data, width, height);
  
  // 合并边缘检测和肤色检测结果
  const allRegions = [...personBlocks, ...skinRegions];
  
  // 过滤和分析人物区域
  allRegions.forEach((block, index) => {
    if (isLikelyPersonRegion(block, width, height)) {
      const region = analyzePersonBlock(block, width, height, index);
      regions.push(region);
    }
  });
  
  console.log(`Found ${regions.length} person-like regions`);
  return regions;
}

function detectSkinRegions(data: Uint8ClampedArray, width: number, height: number) {
  const regions: any[] = [];
  const visited = new Array(width * height).fill(false);
  
  for (let y = 0; y < height; y += 2) { // 跳跃采样提高性能
    for (let x = 0; x < width; x += 2) {
      const index = y * width + x;
      if (visited[index]) continue;
      
      const pixelIndex = index * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      
      if (isSkinColor(r, g, b)) {
        const region = floodFillSkinRegion(data, visited, x, y, width, height);
        if (region.length > 50) { // 最小区域大小
          regions.push(region);
        }
      }
    }
  }
  
  return regions;
}

function isSkinColor(r: number, g: number, b: number): boolean {
  // 简单的肤色检测算法
  // 基于RGB值的肤色范围
  const skinCondition1 = r > 95 && g > 40 && b > 20 && 
                         Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                         Math.abs(r - g) > 15 && r > g && r > b;
  
  const skinCondition2 = r > 220 && g > 210 && b > 170 &&
                         Math.abs(r - g) <= 15 && r > b && g > b;
  
  return skinCondition1 || skinCondition2;
}

function floodFillSkinRegion(data: Uint8ClampedArray, visited: boolean[], startX: number, startY: number, width: number, height: number) {
  const stack = [{x: startX, y: startY}];
  const region: {x: number, y: number}[] = [];
  
  while (stack.length > 0 && region.length < 1000) { // 限制区域大小
    const {x, y} = stack.pop()!;
    const index = y * width + x;
    
    if (x < 0 || x >= width || y < 0 || y >= height || visited[index]) {
      continue;
    }
    
    const pixelIndex = index * 4;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];
    
    if (!isSkinColor(r, g, b)) continue;
    
    visited[index] = true;
    region.push({x, y});
    
    // 4连通
    stack.push({x: x + 1, y});
    stack.push({x: x - 1, y});
    stack.push({x, y: y + 1});
    stack.push({x, y: y - 1});
  }
  
  return region;
}

function isLikelyFaceRegion(region: {x: number, y: number}[], width: number, height: number): boolean {
  if (region.length < 100) return false;
  
  // 计算边界框
  let minX = region[0].x, maxX = region[0].x;
  let minY = region[0].y, maxY = region[0].y;
  
  for (const point of region) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }
  
  const regionWidth = maxX - minX;
  const regionHeight = maxY - minY;
  
  // 人脸通常是椭圆形，宽高比在合理范围内
  const aspectRatio = regionWidth / regionHeight;
  const area = regionWidth * regionHeight;
  const imageArea = width * height;
  const areaRatio = area / imageArea;
  
  // 人脸特征：
  // 1. 宽高比在0.6-1.4之间（接近正方形或略宽）
  // 2. 占图像面积的0.5%-40%
  // 3. 不能太小或太大
  return aspectRatio > 0.6 && aspectRatio < 1.4 && 
         areaRatio > 0.005 && areaRatio < 0.4 &&
         regionWidth > 20 && regionHeight > 20;
}

function detectEdges(data: Uint8ClampedArray, width: number, height: number): number[] {
  const edges = new Array(width * height).fill(0);
  const threshold = 30; // 降低阈值以检测更细微的边缘
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = y * width + x;
      const pixelIndex = index * 4;
      
      // 计算灰度值
      const gray = 0.299 * data[pixelIndex] + 0.587 * data[pixelIndex + 1] + 0.114 * data[pixelIndex + 2];
      
      // Sobel算子
      const gx = 
        -1 * getGray(data, x-1, y-1, width) + 1 * getGray(data, x+1, y-1, width) +
        -2 * getGray(data, x-1, y, width) + 2 * getGray(data, x+1, y, width) +
        -1 * getGray(data, x-1, y+1, width) + 1 * getGray(data, x+1, y+1, width);
      
      const gy = 
        -1 * getGray(data, x-1, y-1, width) + -2 * getGray(data, x, y-1, width) + -1 * getGray(data, x+1, y-1, width) +
        1 * getGray(data, x-1, y+1, width) + 2 * getGray(data, x, y+1, width) + 1 * getGray(data, x+1, y+1, width);
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edges[index] = magnitude > threshold ? 255 : 0;
    }
  }
  
  return edges;
}

function getGray(data: Uint8ClampedArray, x: number, y: number, width: number): number {
  const index = (y * width + x) * 4;
  return 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
}

function findConnectedComponents(edges: number[], width: number, height: number): {x: number, y: number}[][] {
  const visited = new Array(width * height).fill(false);
  const components: {x: number, y: number}[][] = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (!visited[index] && edges[index] > 0) {
        const component = floodFillComponent(edges, visited, x, y, width, height);
        if (component.length > 20) { // 最小组件大小
          components.push(component);
        }
      }
    }
  }
  
  return components;
}

function floodFillComponent(edges: number[], visited: boolean[], startX: number, startY: number, width: number, height: number): {x: number, y: number}[] {
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

function isLikelyPersonRegion(component: {x: number, y: number}[], width: number, height: number): boolean {
  if (component.length < 200) return false; // 人物区域应该更大
  
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
  
  // 人物区域特征检查
  const aspectRatio = blockWidth / blockHeight;
  const area = blockWidth * blockHeight;
  const imageArea = width * height;
  const areaRatio = area / imageArea;
  
  // 人物区域判断条件（更宽松的宽高比，更大的面积范围）
  const isGoodAspectRatio = aspectRatio > 0.3 && aspectRatio < 3.0; // 人物可以是站立或坐着
  const isReasonableSize = areaRatio > 0.02 && areaRatio < 0.6; // 占图像2%-60%
  const isNotTooSmall = blockWidth > 40 && blockHeight > 40; // 最小尺寸
  const isNotTooLarge = areaRatio < 0.4; // 不能太大
  
  return isGoodAspectRatio && isReasonableSize && isNotTooSmall && isNotTooLarge;
}

function analyzePersonBlock(component: {x: number, y: number}[], width: number, height: number, index: number) {
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
  
  // 计算人物大小（相对于图像面积的百分比）
  const personSize = ((blockWidth * blockHeight) / (width * height)) * 100;
  
  // 确定位置
  const relativeX = centerX / width;
  const relativeY = centerY / height;
  let position: 'top' | 'center' | 'bottom' | 'left' | 'right';
  
  if (relativeY < 0.33) position = 'top';
  else if (relativeY > 0.67) position = 'bottom';
  else if (relativeX < 0.33) position = 'left';
  else if (relativeX > 0.67) position = 'right';
  else position = 'center';
  
  // 计算置信度 - 基于多个因素
  const density = component.length / (blockWidth * blockHeight);
  const sizeScore = Math.min(100, personSize * 2); // 大小分数
  const densityScore = Math.min(100, density * 500); // 密度分数
  const aspectRatio = blockWidth / blockHeight;
  const aspectScore = aspectRatio > 0.5 && aspectRatio < 2.0 ? 100 : 50; // 合理比例加分
  
  let confidence = 40; // 基础置信度
  if (personSize > 10) confidence += 20; // 合理大小加分
  if (position === 'top' || position === 'center') confidence += 15; // 好位置加分
  if (aspectRatio > 0.5 && aspectRatio < 2.0) confidence += 15; // 好比例加分
  if (density > 0.3) confidence += 10; // 好密度加分
  
  return {
    bbox: { x0: minX, y0: minY, x1: maxX, y1: maxY },
    personSize,
    position,
    confidence: Math.min(100, confidence),
    area: blockWidth * blockHeight,
    aspectRatio
  };
}

function detectFacesHeuristic(imageData: ImageData, width: number, height: number): FaceDetection[] {
  // 改进的启发式检测：更保守的方法
  const faces: FaceDetection[] = [];
  
  // 只在明确有人脸特征时才添加
  const centerX = width / 2;
  const centerY = height / 2;
  const faceSize = Math.min(width, height) * 0.25; // 更保守的大小估计
  
  // 分析多个区域
  const centerRegion = analyzeRegion(imageData, 
    centerX - faceSize/2, centerY - faceSize/2, 
    faceSize, faceSize, width, height);
  
  // 更严格的判断条件
  if (centerRegion.hasSkinTones && centerRegion.hasContrast && centerRegion.skinRatio > 0.2) {
    faces.push({
      x: centerX - faceSize/2,
      y: centerY - faceSize/2,
      width: faceSize,
      height: faceSize,
      confidence: 0.7,
      expressions: {
        happy: 0.3,
        neutral: 0.7,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0
      }
    });
  }
  
  // 检查上半部分，但要求更高的置信度
  const upperY = height * 0.25;
  const upperRegion = analyzeRegion(imageData,
    centerX - faceSize/2, upperY - faceSize/2,
    faceSize, faceSize, width, height);
  
  if (upperRegion.hasSkinTones && upperRegion.hasContrast && upperRegion.skinRatio > 0.25 && faces.length === 0) {
    faces.push({
      x: centerX - faceSize/2,
      y: upperY - faceSize/2,
      width: faceSize,
      height: faceSize,
      confidence: 0.6,
      expressions: {
        happy: 0.2,
        neutral: 0.8,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0
      }
    });
  }
  
  return faces;
}

function analyzeRegion(imageData: ImageData, x: number, y: number, w: number, h: number, imgWidth: number, imgHeight: number) {
  const data = imageData.data;
  let skinPixels = 0;
  let totalPixels = 0;
  let brightnesses: number[] = [];
  
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(imgWidth, Math.floor(x + w));
  const endY = Math.min(imgHeight, Math.floor(y + h));
  
  for (let py = startY; py < endY; py += 2) {
    for (let px = startX; px < endX; px += 2) {
      const index = (py * imgWidth + px) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      
      if (isSkinColor(r, g, b)) {
        skinPixels++;
      }
      
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      brightnesses.push(brightness);
      totalPixels++;
    }
  }
  
  const skinRatio = skinPixels / totalPixels;
  const avgBrightness = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
  const brightnessVariance = brightnesses.reduce((sum, b) => sum + Math.pow(b - avgBrightness, 2), 0) / brightnesses.length;
  
  return {
    hasSkinTones: skinRatio > 0.15, // 提高到至少15%的肤色像素
    hasContrast: Math.sqrt(brightnessVariance) > 25, // 提高对比度要求
    skinRatio,
    avgBrightness,
    contrast: Math.sqrt(brightnessVariance)
  };
}

function createFaceDetection(region: {x: number, y: number}[], width: number, height: number): FaceDetection {
  // 计算边界框
  let minX = region[0].x, maxX = region[0].x;
  let minY = region[0].y, maxY = region[0].y;
  
  for (const point of region) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }
  
  const faceWidth = maxX - minX;
  const faceHeight = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  // 基于区域特征估算置信度
  const area = faceWidth * faceHeight;
  const imageArea = width * height;
  const areaRatio = area / imageArea;
  const aspectRatio = faceWidth / faceHeight;
  
  let confidence = 0.4; // 基础置信度
  if (areaRatio > 0.02 && areaRatio < 0.3) confidence += 0.2; // 合理大小
  if (aspectRatio > 0.7 && aspectRatio < 1.3) confidence += 0.2; // 合理比例
  if (centerY < height * 0.7) confidence += 0.1; // 在上半部分
  
  // 模拟表情分析（基于位置和大小的启发式）
  const expressions = {
    happy: Math.random() * 0.3 + 0.2,
    neutral: Math.random() * 0.4 + 0.4,
    sad: Math.random() * 0.1,
    angry: Math.random() * 0.1,
    fearful: Math.random() * 0.05,
    disgusted: Math.random() * 0.05,
    surprised: Math.random() * 0.1
  };
  
  // 归一化表情概率
  const total = Object.values(expressions).reduce((a, b) => a + b, 0);
  Object.keys(expressions).forEach(key => {
    expressions[key as keyof typeof expressions] /= total;
  });
  
  return {
    x: minX,
    y: minY,
    width: faceWidth,
    height: faceHeight,
    confidence: Math.min(confidence, 0.9),
    expressions,
    age: 25 + Math.random() * 20, // 模拟年龄
    gender: Math.random() > 0.5 ? 'male' : 'female',
    genderProbability: 0.6 + Math.random() * 0.3
  };
}

function analyzePersonData(personRegions: any[], imageWidth: number, imageHeight: number): FaceAnalysis {
  if (personRegions.length === 0) {
    return getDefaultPersonAnalysis();
  }
  
  // 合并重叠区域，计算总的人物覆盖面积
  const mergedRegions = mergeOverlappingRegions(personRegions, imageWidth, imageHeight);
  
  // 计算总人物覆盖面积
  let totalPersonArea = 0;
  mergedRegions.forEach(region => {
    totalPersonArea += region.area;
  });
  const personCoverage = (totalPersonArea / (imageWidth * imageHeight)) * 100;
  
  // 计算平均人物大小
  const averagePersonSize = mergedRegions.reduce((sum, region) => {
    const imageArea = imageWidth * imageHeight;
    return sum + (region.area / imageArea) * 100;
  }, 0) / mergedRegions.length;
  
  // 分析主要表情（简化版）
  let dominantExpression = 'neutral';
  if (personCoverage > 30) {
    dominantExpression = 'happy'; // 大面积人物通常表示积极内容
  } else if (personCoverage > 15) {
    dominantExpression = 'neutral';
  } else {
    dominantExpression = 'neutral';
  }
  
  // 检测是否有特写（人物占图像面积超过40%）
  const hasCloseUpFace = personCoverage > 40;
  
  // 分析人物位置
  const personPositions = mergedRegions.map(region => {
    const centerX = (region.bbox.x0 + (region.bbox.x1 - region.bbox.x0) / 2) / imageWidth;
    const centerY = (region.bbox.y0 + (region.bbox.y1 - region.bbox.y0) / 2) / imageHeight;
    
    if (centerY < 0.33) return 'top';
    if (centerY > 0.67) return 'bottom';
    if (centerX < 0.33) return 'left';
    if (centerX > 0.67) return 'right';
    return 'center';
  });
  
  // 计算平均年龄（简化估算）
  const agesWithValues = mergedRegions.filter(region => region.age !== undefined);
  const averageAge = agesWithValues.length > 0 
    ? agesWithValues.reduce((sum, region) => sum + region.age!, 0) / agesWithValues.length
    : undefined;
  
  return {
    averageFaceSize: averagePersonSize,
    personCoverage,
    dominantExpression,
    hasCloseUpFace,
    facePositions: [...new Set(personPositions)],
    averageAge
  };
}

function mergeOverlappingRegions(regions: any[], imageWidth: number, imageHeight: number): any[] {
  if (regions.length === 0) return [];
  
  const merged: any[] = [];
  const used = new Array(regions.length).fill(false);
  
  for (let i = 0; i < regions.length; i++) {
    if (used[i]) continue;
    
    let currentRegion = regions[i];
    used[i] = true;
    
    // 查找重叠区域
    for (let j = i + 1; j < regions.length; j++) {
      if (used[j]) continue;
      
      if (regionsOverlap(currentRegion.bbox, regions[j].bbox)) {
        // 合并区域
        currentRegion = mergeRegions(currentRegion, regions[j]);
        used[j] = true;
      }
    }
    
    merged.push(currentRegion);
  }
  
  return merged;
}

function regionsOverlap(bbox1: any, bbox2: any): boolean {
  return !(bbox1.x1 < bbox2.x0 || bbox2.x1 < bbox1.x0 || 
           bbox1.y1 < bbox2.y0 || bbox2.y1 < bbox1.y0);
}

function mergeRegions(region1: any, region2: any): any {
  const minX = Math.min(region1.bbox.x0, region2.bbox.x0);
  const minY = Math.min(region1.bbox.y0, region2.bbox.y0);
  const maxX = Math.max(region1.bbox.x1, region2.bbox.x1);
  const maxY = Math.max(region1.bbox.y1, region2.bbox.y1);
  
  return {
    bbox: { x0: minX, y0: minY, x1: maxX, y1: maxY },
    area: (maxX - minX) * (maxY - minY),
    confidence: Math.max(region1.confidence, region2.confidence),
    age: (region1.age + region2.age) / 2
  };
}

function getDefaultPersonAnalysis(): FaceAnalysis {
  return {
    averageFaceSize: 0,
    personCoverage: 0,
    dominantExpression: 'neutral',
    hasCloseUpFace: false,
    facePositions: []
  };
}

export function generateFaceComparisonSuggestions(
  analysisA: FaceAnalysis,
  analysisB: FaceAnalysis
): FaceComparisonSuggestion[] {
  const suggestions: FaceComparisonSuggestion[] = [];
  
  // 人物覆盖面积对比
  const coverageDiff = Math.abs(analysisA.personCoverage - analysisB.personCoverage);
  if (coverageDiff > 5) {
    const winner = analysisB.personCoverage > analysisA.personCoverage ? 'B' : 'A';
    const higher = winner === 'B' ? analysisB.personCoverage : analysisA.personCoverage;
    const lower = winner === 'B' ? analysisA.personCoverage : analysisB.personCoverage;
    
    suggestions.push({
      type: 'person_coverage',
      message: `Version ${winner} has better person coverage (${higher.toFixed(1)}% vs ${lower.toFixed(1)}%)`,
      winner,
      improvement: 'Optimal person coverage (20-50%) creates strong visual impact and engagement',
      score: Math.min(coverageDiff * 3, 100),
      details: `Person coverage difference: ${coverageDiff.toFixed(1)}%`
    });
  }
  
  // 人物大小对比
  if (analysisA.personCoverage > 0 && analysisB.personCoverage > 0) {
    const faceSizeDiff = Math.abs(analysisA.averageFaceSize - analysisB.averageFaceSize);
    if (faceSizeDiff > 5) {
      const winner = analysisB.averageFaceSize > analysisA.averageFaceSize ? 'B' : 'A';
      const larger = winner === 'B' ? analysisB.averageFaceSize : analysisA.averageFaceSize;
      const smaller = winner === 'B' ? analysisA.averageFaceSize : analysisB.averageFaceSize;
      
      suggestions.push({
        type: 'face_size',
        message: `Version ${winner} has larger person presence (${larger.toFixed(1)}% vs ${smaller.toFixed(1)}% of image)`,
        winner,
        improvement: 'Larger person presence is more engaging and creates stronger visual impact',
        score: Math.min(faceSizeDiff * 5, 100),
        details: `Person size difference: ${faceSizeDiff.toFixed(1)}%`
      });
    }
  }
  
  // 特写对比
  if (analysisA.hasCloseUpFace !== analysisB.hasCloseUpFace) {
    const winner = analysisB.hasCloseUpFace ? 'B' : 'A';
    
    suggestions.push({
      type: 'face_size',
      message: `Version ${winner} has close-up person shots`,
      winner,
      improvement: 'Close-up shots create stronger emotional impact and higher engagement',
      score: 80,
      details: 'Close-up shots (>40% of image area) are more attention-grabbing'
    });
  }
  
  // 表情对比
  if (analysisA.dominantExpression !== analysisB.dominantExpression) {
    const expressionScores = {
      happy: 90,
      surprised: 80,
      neutral: 60,
      sad: 40,
      angry: 70,
      fearful: 50,
      disgusted: 30
    };
    
    const scoreA = expressionScores[analysisA.dominantExpression as keyof typeof expressionScores] || 50;
    const scoreB = expressionScores[analysisB.dominantExpression as keyof typeof expressionScores] || 50;
    
    if (Math.abs(scoreA - scoreB) > 10) {
      const winner = scoreB > scoreA ? 'B' : 'A';
      const winnerExpression = winner === 'B' ? analysisB.dominantExpression : analysisA.dominantExpression;
      
      suggestions.push({
        type: 'face_expression',
        message: `Version ${winner} has more engaging expression (${winnerExpression})`,
        winner,
        improvement: 'Positive expressions like happy and surprised attract more clicks',
        score: Math.abs(scoreA - scoreB),
        details: `Expression comparison: ${analysisA.dominantExpression} vs ${analysisB.dominantExpression}`
      });
    }
  }
  
  return suggestions.sort((a, b) => b.score - a.score);
}

export function predictCTRWithFaces(faceAnalysis: FaceAnalysis, baseAnalysis: any): number {
  let baseCTR = baseAnalysis ? 8 : 6; // 基础CTR
  
  // 人物覆盖面积因子
  if (faceAnalysis.personCoverage > 40) {
    baseCTR *= 1.4; // 大面积人物效果很好
  } else if (faceAnalysis.personCoverage > 20) {
    baseCTR *= 1.3; // 中等面积人物效果好
  } else if (faceAnalysis.personCoverage > 10) {
    baseCTR *= 1.2; // 小面积人物有一定效果
  }
  
  // 特写因子
  if (faceAnalysis.hasCloseUpFace) {
    baseCTR *= 1.3; // 特写效果很好
  } else if (faceAnalysis.averageFaceSize > 10) {
    baseCTR *= 1.2; // 大人物效果好
  }
  
  // 表情因子
  const expressionMultipliers = {
    happy: 1.3,
    surprised: 1.25,
    neutral: 1.0,
    angry: 1.15,
    sad: 0.9,
    fearful: 0.85,
    disgusted: 0.8
  };
  
  const expressionMultiplier = expressionMultipliers[faceAnalysis.dominantExpression as keyof typeof expressionMultipliers] || 1.0;
  baseCTR *= expressionMultiplier;
  
  // 添加随机变化
  const randomVariation = (Math.random() - 0.5) * 2;
  
  return Math.max(3, Math.min(25, baseCTR + randomVariation));
}

// 清理资源
export function cleanupFaceDetection() {
  console.log('Person coverage analysis cleanup completed');
}