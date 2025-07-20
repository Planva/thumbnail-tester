export interface ThumbnailScore {
  overallScore: number;
  categoryScores: {
    visual: number;
    text: number;
    person: number;
    engagement: number;
  };
  recommendations: Recommendation[];
  strengths: string[];
  weaknesses: string[];
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  predictedCTR: number;
}

export interface Recommendation {
  category: 'visual' | 'text' | 'person' | 'engagement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionable: boolean;
}

import { ImageAnalysis } from './imageAnalysis';

export function calculateThumbnailScore(analysis: ImageAnalysis): ThumbnailScore {
  // 1. 视觉质量评分 (25%)
  const visualScore = calculateVisualScore(analysis);
  
  // 2. 文字质量评分 (25%)
  const textScore = calculateTextScore(analysis);
  
  // 3. 人物质量评分 (30%)
  const personScore = calculatePersonScore(analysis);
  
  // 4. 参与度预测评分 (20%)
  const engagementScore = calculateEngagementScore(analysis);
  
  // 加权计算总分
  const overallScore = Math.round(
    visualScore * 0.25 +
    textScore * 0.25 +
    personScore * 0.30 +
    engagementScore * 0.20
  );
  
  // 生成建议
  const recommendations = generateRecommendations(analysis, {
    visual: visualScore,
    text: textScore,
    person: personScore,
    engagement: engagementScore
  });
  
  // 识别优势和劣势
  const strengths = identifyStrengths(analysis, {
    visual: visualScore,
    text: textScore,
    person: personScore,
    engagement: engagementScore
  });
  
  const weaknesses = identifyWeaknesses(analysis, {
    visual: visualScore,
    text: textScore,
    person: personScore,
    engagement: engagementScore
  });
  
  return {
    overallScore,
    categoryScores: {
      visual: visualScore,
      text: textScore,
      person: personScore,
      engagement: engagementScore
    },
    recommendations,
    strengths,
    weaknesses,
    grade: calculateGrade(overallScore),
    predictedCTR: calculatePredictedCTR(overallScore, analysis)
  };
}

function calculateVisualScore(analysis: ImageAnalysis): number {
  let score = 0;
  
  // 亮度评分 (30%)
  const brightnessScore = calculateBrightnessScore(analysis.brightness);
  score += brightnessScore * 0.3;
  
  // 对比度评分 (30%)
  const contrastScore = calculateContrastScore(analysis.contrast);
  score += contrastScore * 0.3;
  
  // 色彩丰富度评分 (25%)
  const colorfulnessScore = calculateColorfulnessScore(analysis.colorfulness);
  score += colorfulnessScore * 0.25;
  
  // 视觉冲击力评分 (15%)
  const impactScore = Math.min(100, analysis.visualImpact);
  score += impactScore * 0.15;
  
  return Math.round(score);
}

function calculateBrightnessScore(brightness: number): number {
  // 最佳亮度范围：120-200
  if (brightness >= 120 && brightness <= 200) {
    return 100;
  } else if (brightness >= 100 && brightness <= 220) {
    return 85;
  } else if (brightness >= 80 && brightness <= 240) {
    return 70;
  } else if (brightness >= 60 && brightness <= 255) {
    return 55;
  } else {
    return 30;
  }
}

function calculateContrastScore(contrast: number): number {
  // 最佳对比度范围：40-80
  if (contrast >= 40 && contrast <= 80) {
    return 100;
  } else if (contrast >= 30 && contrast <= 90) {
    return 85;
  } else if (contrast >= 20 && contrast <= 100) {
    return 70;
  } else if (contrast >= 10) {
    return 55;
  } else {
    return 30;
  }
}

function calculateColorfulnessScore(colorfulness: number): number {
  // 最佳色彩丰富度：30-60%
  if (colorfulness >= 30 && colorfulness <= 60) {
    return 100;
  } else if (colorfulness >= 20 && colorfulness <= 70) {
    return 85;
  } else if (colorfulness >= 15 && colorfulness <= 80) {
    return 70;
  } else if (colorfulness >= 10) {
    return 55;
  } else {
    return 40;
  }
}

function calculateTextScore(analysis: ImageAnalysis): number {
  if (!analysis.textAnalysis) {
    return 50; // 默认分数
  }
  
  const textAnalysis = analysis.textAnalysis;
  let score = 0;
  
  // 文字可读性 (40%)
  score += Math.min(100, textAnalysis.readabilityScore) * 0.4;
  
  // 标题质量 (30%)
  const titleScore = textAnalysis.hasTitle ? textAnalysis.titleQuality : 20;
  score += titleScore * 0.3;
  
  // 字体大小 (20%)
  const fontSizeScore = calculateFontSizeScore(textAnalysis.averageFontSize);
  score += fontSizeScore * 0.2;
  
  // 文字覆盖面积 (10%)
  const coverageScore = calculateTextCoverageScore(textAnalysis.textCoverage);
  score += coverageScore * 0.1;
  
  return Math.round(score);
}

function calculateFontSizeScore(fontSize: number): number {
  // 最佳字体大小：4-8%
  if (fontSize >= 4 && fontSize <= 8) {
    return 100;
  } else if (fontSize >= 3 && fontSize <= 10) {
    return 85;
  } else if (fontSize >= 2 && fontSize <= 12) {
    return 70;
  } else if (fontSize >= 1) {
    return 50;
  } else {
    return 20;
  }
}

function calculateTextCoverageScore(coverage: number): number {
  // 最佳文字覆盖：5-20%
  if (coverage >= 5 && coverage <= 20) {
    return 100;
  } else if (coverage >= 3 && coverage <= 25) {
    return 85;
  } else if (coverage >= 1 && coverage <= 30) {
    return 70;
  } else if (coverage > 0) {
    return 50;
  } else {
    return 20;
  }
}

function calculatePersonScore(analysis: ImageAnalysis): number {
  if (!analysis.faceAnalysis) {
    return 40; // 无人物时的默认分数
  }
  
  const faceAnalysis = analysis.faceAnalysis;
  let score = 0;
  
  // 人物覆盖面积 (60%)
  const coverageScore = calculatePersonCoverageScore(faceAnalysis.personCoverage);
  score += coverageScore * 0.6;
  
  // 特写效果 (25%)
  const closeUpScore = faceAnalysis.hasCloseUpFace ? 100 : 60;
  score += closeUpScore * 0.25;
  
  // 表情效果 (15%)
  const expressionScore = calculateExpressionScore(faceAnalysis.dominantExpression);
  score += expressionScore * 0.15;
  
  return Math.round(score);
}

function calculatePersonCoverageScore(coverage: number): number {
  // 最佳人物覆盖：20-50%
  if (coverage >= 20 && coverage <= 50) {
    return 100;
  } else if (coverage >= 15 && coverage <= 60) {
    return 90;
  } else if (coverage >= 10 && coverage <= 70) {
    return 80;
  } else if (coverage >= 5 && coverage <= 80) {
    return 70;
  } else if (coverage > 0) {
    return 50;
  } else {
    return 30; // 无人物
  }
}

function calculateExpressionScore(expression: string): number {
  const expressionScores: { [key: string]: number } = {
    happy: 100,
    surprised: 90,
    excited: 95,
    neutral: 70,
    serious: 60,
    angry: 80,
    sad: 50,
    fearful: 40,
    disgusted: 30
  };
  
  return expressionScores[expression] || 70;
}

function calculateEngagementScore(analysis: ImageAnalysis): number {
  let score = 0;
  
  // 视觉冲击力 (40%)
  score += Math.min(100, analysis.visualImpact) * 0.4;
  
  // 色彩吸引力 (30%)
  const colorAttraction = calculateColorAttraction(analysis);
  score += colorAttraction * 0.3;
  
  // 构图平衡 (20%)
  const compositionScore = calculateCompositionScore(analysis);
  score += compositionScore * 0.2;
  
  // 清晰度 (10%)
  const clarityScore = Math.min(100, analysis.textReadability * 2);
  score += clarityScore * 0.1;
  
  return Math.round(score);
}

function calculateColorAttraction(analysis: ImageAnalysis): number {
  // 基于色彩丰富度和对比度
  const colorfulness = analysis.colorfulness;
  const contrast = analysis.contrast;
  
  let score = 0;
  
  // 色彩丰富度贡献 (60%)
  if (colorfulness >= 35) score += 60;
  else if (colorfulness >= 25) score += 50;
  else if (colorfulness >= 15) score += 40;
  else score += 25;
  
  // 对比度贡献 (40%)
  if (contrast >= 50) score += 40;
  else if (contrast >= 35) score += 35;
  else if (contrast >= 25) score += 30;
  else score += 20;
  
  return Math.min(100, score);
}

function calculateCompositionScore(analysis: ImageAnalysis): number {
  let score = 70; // 基础分数
  
  // 如果有人物分析
  if (analysis.faceAnalysis && analysis.faceAnalysis.personCoverage > 0) {
    // 人物位置加分
    const positions = analysis.faceAnalysis.facePositions;
    if (positions.includes('center')) score += 15;
    else if (positions.includes('top')) score += 10;
    
    // 人物大小平衡
    if (analysis.faceAnalysis.personCoverage >= 20 && analysis.faceAnalysis.personCoverage <= 60) {
      score += 15;
    }
  }
  
  // 如果有文字分析
  if (analysis.textAnalysis && analysis.textAnalysis.textCount > 0) {
    // 文字位置加分
    const textPositions = analysis.textAnalysis.textPositions;
    if (textPositions.includes('top') || textPositions.includes('center')) {
      score += 10;
    }
  }
  
  return Math.min(100, score);
}

function generateRecommendations(analysis: ImageAnalysis, scores: any): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // 视觉质量建议
  if (scores.visual < 70) {
    if (analysis.brightness < 120) {
      recommendations.push({
        category: 'visual',
        priority: 'high',
        title: 'Increase Brightness',
        description: 'Current brightness is too low, consider increasing brightness for better visibility',
        impact: 'Improve CTR by 15-25%',
        actionable: true
      });
    }
    
    if (analysis.contrast < 40) {
      recommendations.push({
        category: 'visual',
        priority: 'high',
        title: 'Enhance Contrast',
        description: 'Low contrast affects text and image clarity',
        impact: 'Improve readability and appeal',
        actionable: true
      });
    }
    
    if (analysis.colorfulness < 25) {
      recommendations.push({
        category: 'visual',
        priority: 'medium',
        title: 'Add More Colors',
        description: 'Richer colors can attract more attention',
        impact: 'Increase visual appeal',
        actionable: true
      });
    }
  }
  
  // 文字质量建议
  if (scores.text < 70 && analysis.textAnalysis) {
    if (!analysis.textAnalysis.hasTitle) {
      recommendations.push({
        category: 'text',
        priority: 'high',
        title: 'Add Title Text',
        description: 'Thumbnail lacks clear title text',
        impact: 'Improve CTR by 20-30%',
        actionable: true
      });
    }
    
    if (analysis.textAnalysis.averageFontSize < 4) {
      recommendations.push({
        category: 'text',
        priority: 'high',
        title: 'Increase Font Size',
        description: 'Text is too small for mobile devices',
        impact: 'Improve mobile CTR',
        actionable: true
      });
    }
    
    if (analysis.textAnalysis.readabilityScore < 60) {
      recommendations.push({
        category: 'text',
        priority: 'medium',
        title: 'Improve Text Readability',
        description: 'Increase text-background contrast, use clearer fonts',
        impact: 'Improve user comprehension',
        actionable: true
      });
    }
  }
  
  // 人物质量建议
  if (scores.person < 70 && analysis.faceAnalysis) {
    if (analysis.faceAnalysis.personCoverage < 15) {
      recommendations.push({
        category: 'person',
        priority: 'medium',
        title: 'Increase Person Size',
        description: 'Person appears small in frame, consider enlarging or cropping',
        impact: 'Improve emotional connection and CTR',
        actionable: true
      });
    }
    
    if (!analysis.faceAnalysis.hasCloseUpFace && analysis.faceAnalysis.personCoverage > 0) {
      recommendations.push({
        category: 'person',
        priority: 'low',
        title: 'Consider Close-up Shots',
        description: 'Close-up shots create stronger visual impact',
        impact: 'Enhance emotional appeal',
        actionable: true
      });
    }
  }
  
  // 参与度建议
  if (scores.engagement < 70) {
    recommendations.push({
      category: 'engagement',
      priority: 'medium',
      title: 'Enhance Visual Impact',
      description: 'Use brighter colors, higher contrast, or more eye-catching composition',
      impact: 'Improve overall engagement',
      actionable: true
    });
  }
  
  // 按优先级排序
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function identifyStrengths(analysis: ImageAnalysis, scores: any): string[] {
  const strengths: string[] = [];
  
  if (scores.visual >= 80) {
    strengths.push('Excellent visual quality - good brightness, contrast and color balance');
  }
  
  if (scores.text >= 80) {
    strengths.push('Clear text presentation - excellent font size and readability');
  }
  
  if (scores.person >= 80) {
    strengths.push('Outstanding person presence - good proportion and expression');
  }
  
  if (scores.engagement >= 80) {
    strengths.push('Strong visual appeal - effectively attracts viewer attention');
  }
  
  // 具体特征优势
  if (analysis.brightness >= 120 && analysis.brightness <= 200) {
    strengths.push('Ideal brightness level');
  }
  
  if (analysis.contrast >= 40) {
    strengths.push('Good contrast');
  }
  
  if (analysis.colorfulness >= 30) {
    strengths.push('Rich color presentation');
  }
  
  if (analysis.textAnalysis?.hasTitle && analysis.textAnalysis.titleQuality >= 80) {
    strengths.push('High-quality title design');
  }
  
  if (analysis.faceAnalysis?.hasCloseUpFace) {
    strengths.push('Effective close-up shots');
  }
  
  return strengths;
}

function identifyWeaknesses(analysis: ImageAnalysis, scores: any): string[] {
  const weaknesses: string[] = [];
  
  if (scores.visual < 60) {
    weaknesses.push('Visual quality needs improvement - brightness, contrast or color issues');
  }
  
  if (scores.text < 60) {
    weaknesses.push('Poor text effectiveness - font size or readability needs improvement');
  }
  
  if (scores.person < 60) {
    weaknesses.push('Insufficient person presence - person size or expression needs optimization');
  }
  
  if (scores.engagement < 60) {
    weaknesses.push('Insufficient visual appeal - overall impact needs strengthening');
  }
  
  // 具体问题
  if (analysis.brightness < 100) {
    weaknesses.push('Brightness too low, affects visibility');
  }
  
  if (analysis.contrast < 30) {
    weaknesses.push('Insufficient contrast, affects clarity');
  }
  
  if (analysis.colorfulness < 20) {
    weaknesses.push('Colors too monotone, lacks visual appeal');
  }
  
  if (analysis.textAnalysis && !analysis.textAnalysis.hasTitle) {
    weaknesses.push('Missing clear title text');
  }
  
  if (analysis.textAnalysis && analysis.textAnalysis.averageFontSize < 3) {
    weaknesses.push('Font too small, poor mobile readability');
  }
  
  if (analysis.faceAnalysis && analysis.faceAnalysis.personCoverage < 10) {
    weaknesses.push('Person too small, lacks emotional connection');
  }
  
  return weaknesses;
}

function calculateGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 60) return 'C';
  return 'D';
}

function calculatePredictedCTR(score: number, analysis: ImageAnalysis): number {
  // 基础CTR基于总分
  let baseCTR = 3 + (score / 100) * 12; // 3-15%的范围
  
  // 人物加成
  if (analysis.faceAnalysis && analysis.faceAnalysis.personCoverage > 20) {
    baseCTR *= 1.3;
  }
  
  // 文字加成
  if (analysis.textAnalysis && analysis.textAnalysis.hasTitle) {
    baseCTR *= 1.2;
  }
  
  // 视觉冲击力加成
  if (analysis.visualImpact > 70) {
    baseCTR *= 1.15;
  }
  
  // 添加一些随机性
  const randomFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1
  baseCTR *= randomFactor;
  
  return Math.max(2, Math.min(25, Number(baseCTR.toFixed(1))));
}