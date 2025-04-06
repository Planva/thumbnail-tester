import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Upload, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('homeTitle')}</title>
        <meta name="description" content={t('homeDescription')} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">
            {t('homeTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('homeDescription')}
          </p>
          <Link
            to="/thumbnail-tester-online-free"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('startTesting')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('freeThumbnailPreview')}</h2>
            <p className="text-gray-600 mb-4">
              {t('freeThumbnailPreviewDescription')}
            </p>
            <Link to="/thumbnail-tester-online-free" className="text-indigo-600 hover:text-indigo-700 font-medium">
              {t('tryFreePreview')} →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('abTestingTool')}</h2>
            <p className="text-gray-600 mb-4">
              {t('abTestingToolDescription')}
            </p>
            <Link to="/youtube-b/b-test" className="text-indigo-600 hover:text-indigo-700 font-medium">
              {t('startAbTesting')} →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('aiAnalysis')}</h2>
            <p className="text-gray-600 mb-4">
              {t('aiAnalysisDescription')}
            </p>
            <Link to="/thumbnail-tester-ai" className="text-indigo-600 hover:text-indigo-700 font-medium">
              {t('tryAiAnalysis')} →
            </Link>
          </div>
        </div>

        <section className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">{t('whyUseTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('realTimePreview')}</h3>
              <p className="text-gray-600">
                {t('realTimePreviewDescription')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('freeOnlineTool')}</h3>
              <p className="text-gray-600">
                {t('freeOnlineToolDescription')}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t('howToUseTitle')}</h2>
          <div className="prose max-w-none">
            <ol className="space-y-4">
              <li>{t('howToUseStep1')}</li>
              <li>{t('howToUseStep2')}</li>
              <li>{t('howToUseStep3')}</li>
              <li>{t('howToUseStep4')}</li>
            </ol>
          </div>
        </section>
      </div>
    </>
  );
}