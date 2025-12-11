import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ScenarioSelector } from './components/ScenarioSelector';
import { generateMockup } from './services/geminiService';
import { ScenarioOption, LoadingState } from './types';
import { PREDEFINED_SCENARIOS } from './constants';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioOption | null>(PREDEFINED_SCENARIOS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedImage) {
      alert("请先上传补丁图片");
      return;
    }
    if (!selectedScenario && !customPrompt) {
      alert("请选择一个场景或输入自定义描述");
      return;
    }

    setLoadingState(LoadingState.GENERATING);
    setErrorMsg(null);
    setResultImage(null);

    // Construct prompt part from preset + custom
    let promptToUse = selectedScenario ? selectedScenario.prompt : "on a plain fabric surface";
    
    // If user typed a custom prompt, we append or replace depending on logic.
    if (!selectedScenario && customPrompt) {
      promptToUse = `on ${customPrompt}`;
    }

    try {
      const generatedImageBase64 = await generateMockup(
        selectedImage, 
        promptToUse, 
        customPrompt
      );
      setResultImage(generatedImageBase64);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "生成失败，请重试");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Controls */}
          <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                配置生成需求
              </h2>
              <div className="text-sm text-gray-500 mb-4 -mt-2 ml-8 space-y-2">
                <p>AI将自动<b>识别图片中的尺寸标注</b>，按真实比例还原补丁大小。</p>
                <p>严格保留补丁原有细节（形状/颜色/纹理），仅去除杂乱背景和文字。支持智能拆分多补丁，并生成如书房、卧室、自然光下的真实熨烫效果图。</p>
              </div>
              
              <div className="space-y-6">
                <FileUpload 
                  selectedImage={selectedImage} 
                  onFileSelect={setSelectedImage} 
                />
                
                <div className="border-t border-gray-100 pt-6">
                   <ScenarioSelector 
                    selectedScenario={selectedScenario}
                    onSelect={setSelectedScenario}
                    customPrompt={customPrompt}
                    onCustomPromptChange={setCustomPrompt}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loadingState === LoadingState.GENERATING || !selectedImage}
              className={`
                w-full py-3.5 px-4 rounded-xl font-semibold text-white shadow-sm transition-all
                ${loadingState === LoadingState.GENERATING || !selectedImage
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:transform active:scale-[0.98]'
                }
              `}
            >
              {loadingState === LoadingState.GENERATING ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>正在构建真实场景...</span>
                </div>
              ) : (
                '✨ 生成真实场景效果图'
              )}
            </button>
            
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="lg:sticky lg:top-24">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  效果预览
                </h2>

                <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 overflow-hidden relative group">
                  {resultImage ? (
                    <>
                      <img 
                        src={resultImage} 
                        alt="Generated Mockup" 
                        className="w-full h-auto object-contain max-h-[600px] transition-opacity duration-500 animate-in fade-in"
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={resultImage} 
                          download="patch-mockup.png"
                          className="bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm border border-gray-200 flex items-center gap-2 backdrop-blur-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          下载图片
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                       <div className="mx-auto w-24 h-24 bg-indigo-50/50 rounded-full flex items-center justify-center mb-4">
                         {loadingState === LoadingState.GENERATING ? (
                           <span className="text-4xl animate-pulse">🧵</span>
                         ) : (
                           <span className="text-4xl grayscale opacity-50">🖼️</span>
                         )}
                       </div>
                       <h3 className="text-gray-900 font-medium mb-1">
                         {loadingState === LoadingState.GENERATING ? '正在施展魔法...' : '等待生成'}
                       </h3>
                       <p className="text-gray-500 text-sm max-w-xs mx-auto">
                         {loadingState === LoadingState.GENERATING 
                           ? 'AI 正在分析尺寸比例，将补丁融入真实场景，同时严格保留其原有细节...' 
                           : '在左侧上传图片并选择场景（如书房笔袋、咖啡馆帆布袋），此处将显示最终效果。'
                         }
                       </p>
                    </div>
                  )}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;