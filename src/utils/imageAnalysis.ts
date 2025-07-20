export interface ImageAnalysis {
  brightness: number;
  contrast: number;
  colorfulness: number;
  dominantColors: string[];
  textReadability: number;
  visualImpact: number;
  textAnalysis?: TextAnalysis;
  faceAnalysis?: FaceAnalysis;
}

export type { ThumbnailScore } from './scoringAlgorithm';

export interface ComparisonSuggestion {
  type: 'brightness' | 'contrast' | 'colorfulness' | 'readability' | 'impact' | 'text_size' | 'text_position' | 'text_readability' | 'text_amount' | 'title_quality';
  message: string;
  winner: 'A' | 'B';
  improvement: string;
  score: number;
  details?: string;
}

import { analyzeTextInImage, generateTextComparisonSuggestions, TextAnalysis } from './textAnalysis';
import { detectFacesInImage, generateFaceComparisonSuggestions, predictCTRWithFaces, FaceAnalysis } from './faceDetection';

export async function analyzeImage(file: File, includeTextAnalysis: boolean = true, includeFaceAnalysis: boolean = true): Promise<ImageAnalysis> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // 调整画布大小，限制最大尺寸以提高性能
      const maxSize = 400;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const analysis: ImageAnalysis = {
        brightness: calculateBrightness(imageData),
        contrast: calculateContrast(imageData),
        colorfulness: calculateColorfulness(imageData),
        dominantColors: extractDominantColors(imageData),
        textReadability: calculateTextReadability(imageData),
        visualImpact: 0
      };
      
      // 计算综合视觉冲击力
      analysis.visualImpact = calculateVisualImpact(analysis);
      
      // 并行进行文字分析和人脸分析
      const analysisPromises: Promise<void>[] = [];
      
      if (includeTextAnalysis) {
        analysisPromises.push(
          analyzeTextInImage(file)
            .then(textAnalysis => {
              analysis.textAnalysis = textAnalysis;
            })
            .catch(() => {
              // 如果文字分析失败，继续执行
            })
        );
      }
      
      if (includeFaceAnalysis) {
        analysisPromises.push(
          detectFacesInImage(file)
            .then(faceAnalysis => {
              analysis.faceAnalysis = faceAnalysis;
            })
            .catch((error) => {
              console.warn('Face analysis failed:', error);
              // 如果人脸分析失败，继续执行
              analysis.faceAnalysis = {
                faceCount: 0,
                faces: [],
                averageFaceSize: 0,
                faceCoverage: 0,
                dominantExpression: 'neutral',
                hasCloseUpFace: false,
                facePositions: []
              };
            })
        );
      }
      
      if (analysisPromises.length > 0) {
        Promise.all(analysisPromises)
          .then(() => {
            resolve(analysis);
          })
          .catch((error) => {
            console.error('Analysis failed, but continuing with basic analysis:', error);
            // Even if advanced analysis fails, return basic analysis
            resolve(analysis);
          });
      } else {
        resolve(analysis);
      }
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export async function analyzeImageLegacy(file: File, includeTextAnalysis: boolean = true): Promise<ImageAnalysis> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // 调整画布大小，限制最大尺寸以提高性能
      const maxSize = 400;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const analysis: ImageAnalysis = {
        brightness: calculateBrightness(imageData),
        contrast: calculateContrast(imageData),
        colorfulness: calculateColorfulness(imageData),
        dominantColors: extractDominantColors(imageData),
        textReadability: calculateTextReadability(imageData),
        visualImpact: 0
      };
      
      // 计算综合视觉冲击力
      analysis.visualImpact = calculateVisualImpact(analysis);
      
      // 如果需要文字分析，则进行分析
      if (includeTextAnalysis) {
        analyzeTextInImage(file)
          .then(textAnalysis => {
            analysis.textAnalysis = textAnalysis;
            resolve(analysis);
          })
          .catch(() => {
            // 如果OCR失败，仍然返回基础分析
            resolve(analysis);
          });
      } else {
        resolve(analysis);
      }
    };
    
    img.src = URL.createObjectURL(file);
  });
}

function calculateBrightness(imageData: ImageData): number {
  const data = imageData.data;
  let totalBrightness = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // 使用加权平均计算亮度（人眼对绿色更敏感）
    totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
  }
  
  return totalBrightness / (data.length / 4);
}

function calculateContrast(imageData: ImageData): number {
  const data = imageData.data;
  const brightnesses: number[] = [];
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    brightnesses.push(0.299 * r + 0.587 * g + 0.114 * b);
  }
  
  // 计算标准差作为对比度指标
  const mean = brightnesses.reduce((sum, b) => sum + b, 0) / brightnesses.length;
  const variance = brightnesses.reduce((sum, b) => sum + Math.pow(b - mean, 2), 0) / brightnesses.length;
  
  return Math.sqrt(variance);
}

function calculateColorfulness(imageData: ImageData): number {
  const data = imageData.data;
  let totalSaturation = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    
    totalSaturation += saturation;
  }
  
  return (totalSaturation / (data.length / 4)) * 100;
}

function extractDominantColors(imageData: ImageData): string[] {
  const data = imageData.data;
  const colorCounts: { [key: string]: number } = {};
  
  // 简化颜色到较少的色彩空间以找到主要颜色
  for (let i = 0; i < data.length; i += 16) { // 采样以提高性能
    const r = Math.floor(data[i] / 32) * 32;
    const g = Math.floor(data[i + 1] / 32) * 32;
    const b = Math.floor(data[i + 2] / 32) * 32;
    
    const colorKey = `${r},${g},${b}`;
    colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
  }
  
  // 获取最常见的3种颜色
  const sortedColors = Object.entries(colorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([color]) => {
      const [r, g, b] = color.split(',').map(Number);
      return `rgb(${r}, ${g}, ${b})`;
    });
  
  return sortedColors;
}

function calculateTextReadability(imageData: ImageData): number {
  const data = imageData.data;
  let edgeCount = 0;
  const width = imageData.width;
  const height = imageData.height;
  
  // 简单的边缘检测来评估文字区域
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      const current = data[i] + data[i + 1] + data[i + 2];
      const right = data[i + 4] + data[i + 5] + data[i + 6];
      const bottom = data[i + width * 4] + data[i + width * 4 + 1] + data[i + width * 4 + 2];
      
      if (Math.abs(current - right) > 100 || Math.abs(current - bottom) > 100) {
        edgeCount++;
      }
    }
  }
  
  // 归一化边缘密度
  return Math.min((edgeCount / (width * height)) * 10000, 100);
}

function calculateVisualImpact(analysis: ImageAnalysis): number {
  // 综合评分算法
  const brightnessScore = Math.min(analysis.brightness / 255 * 100, 100);
  const contrastScore = Math.min(analysis.contrast / 50 * 100, 100);
  const colorfulnessScore = analysis.colorfulness;
  const readabilityScore = Math.min(analysis.textReadability, 100);
  
  // 加权平均
  return (
    brightnessScore * 0.2 +
    contrastScore * 0.3 +
    colorfulnessScore * 0.3 +
    readabilityScore * 0.2
  );
}

export function generateSmartSuggestions(
  analysisA: ImageAnalysis,
  analysisB: ImageAnalysis
): ComparisonSuggestion[] {
  let suggestions: ComparisonSuggestion[] = [];
  
  // 亮度对比分析
  const brightnessDiff = Math.abs(analysisA.brightness - analysisB.brightness);
  if (brightnessDiff > 20) {
    const winner = analysisB.brightness > analysisA.brightness ? 'B' : 'A';
    const brighter = winner === 'B' ? analysisB.brightness : analysisA.brightness;
    const darker = winner === 'B' ? analysisA.brightness : analysisB.brightness;
    
    suggestions.push({
      type: 'brightness',
      message: `Version ${winner} is significantly brighter (${Math.round(brighter)} vs ${Math.round(darker)})`,
      winner,
      improvement: brighter > 180 ? 'Bright thumbnails are more noticeable on mobile devices' : 'Moderate brightness helps with text readability',
      score: Math.min(brightnessDiff / 50 * 100, 100)
    });
  }
  
  // 对比度分析
  const contrastDiff = Math.abs(analysisA.contrast - analysisB.contrast);
  if (contrastDiff > 10) {
    const winner = analysisB.contrast > analysisA.contrast ? 'B' : 'A';
    const higherContrast = winner === 'B' ? analysisB.contrast : analysisA.contrast;
    const lowerContrast = winner === 'B' ? analysisA.contrast : analysisB.contrast;
    
    suggestions.push({
      type: 'contrast',
      message: `Version ${winner} has higher contrast (${Math.round(higherContrast)} vs ${Math.round(lowerContrast)})`,
      winner,
      improvement: 'Higher contrast makes text clearer and improves click-through rates',
      score: Math.min(contrastDiff / 30 * 100, 100)
    });
  }
  
  // 色彩丰富度分析
  const colorfulnessDiff = Math.abs(analysisA.colorfulness - analysisB.colorfulness);
  if (colorfulnessDiff > 8) {
    const winner = analysisB.colorfulness > analysisA.colorfulness ? 'B' : 'A';
    const moreColorful = winner === 'B' ? analysisB.colorfulness : analysisA.colorfulness;
    const lessColorful = winner === 'B' ? analysisA.colorfulness : analysisB.colorfulness;
    
    suggestions.push({
      type: 'colorfulness',
      message: `Version ${winner} is more colorful (${Math.round(moreColorful)}% vs ${Math.round(lessColorful)}%)`,
      winner,
      improvement: moreColorful > 40 ? 'Rich colors attract more attention' : 'Moderate colors help with professionalism',
      score: Math.min(colorfulnessDiff / 20 * 100, 100)
    });
  }
  
  // 文字可读性分析
  const readabilityDiff = Math.abs(analysisA.textReadability - analysisB.textReadability);
  if (readabilityDiff > 3) {
    const winner = analysisB.textReadability > analysisA.textReadability ? 'B' : 'A';
    
    suggestions.push({
      type: 'readability',
      message: `Version ${winner} has clearer text areas`,
      winner,
      improvement: 'Clear text boundaries improve title readability',
      score: Math.min(readabilityDiff / 10 * 100, 100)
    });
  }
  
  // 综合视觉冲击力
  const impactDiff = Math.abs(analysisA.visualImpact - analysisB.visualImpact);
  if (impactDiff > 3) {
    const winner = analysisB.visualImpact > analysisA.visualImpact ? 'B' : 'A';
    
    suggestions.push({
      type: 'impact',
      message: `Version ${winner} has better overall visual impact`,
      winner,
      improvement: 'Better visual impact typically leads to higher click-through rates',
      score: Math.min(impactDiff / 10 * 100, 100)
    });
  }
  
  // 添加文字分析建议
  if (analysisA.textAnalysis && analysisB.textAnalysis) {
    const textSuggestions = generateTextComparisonSuggestions(
      analysisA.textAnalysis,
      analysisB.textAnalysis
    );
    
    // 将文字建议转换为通用建议格式
    const convertedTextSuggestions = textSuggestions.map(ts => ({
      type: ts.type as ComparisonSuggestion['type'],
      message: ts.message,
      winner: ts.winner,
      improvement: ts.improvement,
      score: ts.score,
      details: ts.details
    }));
    
    suggestions = [...suggestions, ...convertedTextSuggestions];
  }
  
  // 添加人脸分析建议
  if (analysisA.faceAnalysis && analysisB.faceAnalysis) {
    const faceSuggestions = generateFaceComparisonSuggestions(
      analysisA.faceAnalysis,
      analysisB.faceAnalysis
    );
    
    // 将人脸建议转换为通用建议格式
    const convertedFaceSuggestions = faceSuggestions.map(fs => ({
      type: fs.type as ComparisonSuggestion['type'],
      message: fs.message,
      winner: fs.winner,
      improvement: fs.improvement,
      score: fs.score,
      details: fs.details
    }));
    
    suggestions = [...suggestions, ...convertedFaceSuggestions];
  }
  
  // 按重要性排序
  return suggestions.sort((a, b) => b.score - a.score);
}

export function predictCTR(analysis: ImageAnalysis): number {
  // 如果有人脸分析，使用增强的CTR预测
  if (analysis.faceAnalysis) {
    return predictCTRWithFaces(analysis.faceAnalysis, analysis);
  }
  
  // 基于分析结果的简单CTR预测模型
  const baseRate = 8; // 基础CTR 8%

  // 亮度因子 (最佳亮度在120-200之间)
  const brightnessFactor = analysis.brightness > 120 && analysis.brightness < 200 ? 1.2 : 
                          analysis.brightness < 80 ? 0.8 : 1.0;
  
  // 对比度因子
  const contrastFactor = analysis.contrast > 40 ? 1.3 : 
                        analysis.contrast < 20 ? 0.9 : 1.0;
  
  // 色彩丰富度因子
  const colorfulnessFactor = analysis.colorfulness > 30 && analysis.colorfulness < 70 ? 1.2 : 
                            analysis.colorfulness < 15 ? 0.9 : 1.0;
  
  // 文字可读性因子
  const readabilityFactor = analysis.textReadability > 20 ? 1.1 : 0.95;
  
  const predictedCTR = baseRate * brightnessFactor * contrastFactor * colorfulnessFactor * readabilityFactor;
  
  // 添加一些随机性，但基于实际分析
  const randomVariation = (Math.random() - 0.5) * 2; // ±1%
  
  return Math.max(3, Math.min(20, predictedCTR + randomVariation));
}