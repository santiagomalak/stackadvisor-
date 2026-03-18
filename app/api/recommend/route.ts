import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore - CommonJS module
import { getRecommendation, generateRoadmap } from '@/lib/decision_logic.js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Get recommendation from decision logic engine
    const recommendation = getRecommendation(answers) as any;

    if (!recommendation.primary) {
      return NextResponse.json(
        { error: 'No suitable stack found for your requirements' },
        { status: 404 }
      );
    }

    // Generate roadmap for the primary recommendation
    const roadmap = generateRoadmap(recommendation.primary.stack, answers);

    // Return complete result
    return NextResponse.json({
      primary: {
        ...recommendation.primary,
        roadmap,
      },
      alternatives: recommendation.alternatives,
      userProfile: recommendation.userProfile,
      totalEvaluated: recommendation.totalEvaluated,
    });
  } catch (error) {
    console.error('Error in recommendation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
