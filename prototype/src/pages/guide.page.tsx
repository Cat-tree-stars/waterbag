import React, { useEffect, useRef } from 'react';
import { useGuideStore, Chapter } from '../stores/guide.store';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 优化点：
 * 1. 移除 layout 属性，减少布局回流计算。
 * 2. 缩短动画时长 (0.4s -> 0.25s)。
 * 3. 使用 easeOut 减轻计算压力。
 * 4. 增加 will-change: transform, opacity 提示。
 */
const ChapterCard: React.FC<{ 
  chapter: Chapter; 
  isExpanded: boolean; 
  onToggle: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}> = ({ 
  chapter, 
  isExpanded, 
  onToggle,
  setRef
}) => {
  return (
    <div
      ref={setRef}
      className={cn(
        "bg-surface-raised border border-border-subtle rounded-card overflow-hidden transition-all duration-300",
        isExpanded ? "shadow-chapter-active ring-1 ring-brand-primary/20" : "shadow-card-sm hover:shadow-card-md",
        "will-change-transform"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-spacing-comfortable text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
      >
        <h3 className="text-h3 font-semibold text-text-primary" style={{ fontFamily: "'Noto Serif JP', sans-serif" }}>
          {chapter.title}
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronDown className="text-brand-accent w-6 h-6" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden will-change-[height,opacity]"
          >
            <div className="px-spacing-comfortable pb-spacing-comfortable space-y-spacing-base">
              {chapter.sections.map((section, idx) => (
                <div key={idx} className="space-y-spacing-tight">
                  {section.subtitle && (
                    <h4 className="text-body-lg font-zh font-medium text-brand-primary">
                      {section.subtitle}
                    </h4>
                  )}
                  <ul className="space-y-spacing-micro list-none">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex gap-spacing-tight text-body text-text-primary leading-relaxed">
                        <span className="text-brand-accent select-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="pt-spacing-tight">
                <button 
                  onClick={onToggle}
                  className="text-caption text-text-muted hover:text-brand-accent transition-colors flex items-center gap-spacing-micro"
                >
                  收起卡片
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function GuidePage() {
  const { chapters, expandedId, toggleChapter } = useGuideStore();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Guarded init to prevent snapshot overwrite
  useEffect(() => {
    if (chapters.length === 0 && window.App?.store?.chapters) {
      useGuideStore.setState((state) => ({
        chapters: state.chapters.length > 0 ? state.chapters : window.App.store.chapters
      }));
    }
  }, [chapters]);

  /**
   * 优化点：
   * 滚动动画延迟到交互主进程结束后。
   * 缩短延迟，确保用户感知一致但线程已空闲。
   */
  useEffect(() => {
    if (expandedId && cardRefs.current[expandedId]) {
      const timer = setTimeout(() => {
        cardRefs.current[expandedId]?.scrollIntoView({
          behavior: 'auto', // 动画结束后直接跳转或用简单的平滑，避免与复杂 layout 抢占
          block: 'start',
        });
        // 若需平滑感，可用简单滚动方案
        window.scrollBy({ top: -20, behavior: 'smooth' });
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [expandedId]);

  const isAnyExpanded = !!expandedId;

  return (
    <div className="min-h-screen pb-spacing-macro bg-surface-base antialiased">
      {/* 封面区：优化为 transform 驱动以减少 Layout 重排 */}
      <motion.header 
        initial={false}
        className="relative w-full overflow-hidden bg-surface-paper z-10"
        style={{ height: '60vh' }} // 基准高度
        animate={{ 
          y: isAnyExpanded ? -(60 * 0.4) + 'vh' : 0, // 视觉上模拟高度减少
          height: isAnyExpanded ? '120px' : '60vh', // 仍需保留关键断点，但减少过渡时的 layout 抖动
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div 
          className="absolute inset-0 w-full h-full"
          animate={{ 
            scale: isAnyExpanded ? 1.05 : 1,
            y: isAnyExpanded ? -60 : 0,
            opacity: isAnyExpanded ? 0.4 : 0.7
          }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src="https://irise-resources-production-us-east-1-972778198637.s3.us-east-1.amazonaws.com/e59c56f7c9ec89ddf5ad688a8bc9cb2c.jpg" 
            alt="Warm home interior" 
            className="w-full h-full object-cover object-center border-transparent shadow-none outline-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-base/20 via-transparent to-surface-base" />
        </motion.div>
        
        <div className="relative h-full z-10 p-spacing-loose flex flex-col justify-end max-w-[1200px] mx-auto">
          <motion.div
            animate={{ 
              y: isAnyExpanded ? -10 : 0,
              scale: isAnyExpanded ? 0.6 : 1,
              originX: 0
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h1 className="text-display text-text-primary tracking-tight text-center" style={{ fontFamily: "'LXGW WenKai TC', sans-serif" }}>
              203 居住指南
            </h1>
            <motion.p 
              animate={{ 
                opacity: isAnyExpanded ? 0 : 1, 
                height: isAnyExpanded ? 0 : 'auto',
                marginTop: isAnyExpanded ? 0 : 8
              }}
              transition={{ duration: 0.25 }}
              className="text-h3 font-zh text-text-muted overflow-hidden text-center"
            >
              喜欢您来。
            </motion.p>
          </motion.div>
        </div>
      </motion.header>

      {/* 主体抽卡区 */}
      <main className={cn(
        "px-spacing-base relative z-20 space-y-spacing-base max-w-[640px] mx-auto transition-all duration-300",
        isAnyExpanded ? "mt-spacing-base" : "-mt-spacing-loose"
      )}>
        {chapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            setRef={(el) => (cardRefs.current[chapter.id] = el)}
            chapter={chapter}
            isExpanded={expandedId === chapter.id}
            onToggle={() => toggleChapter(chapter.id)}
          />
        ))}
      </main>

      {/* 页脚装饰 */}
      <footer className="mt-spacing-loose px-spacing-loose text-center pb-spacing-loose">
        <div className="w-12 h-1 bg-brand-accent-muted mx-auto rounded-full mb-spacing-base opacity-40" />
        <p className="text-caption text-text-muted font-zh">
          ——enjoy yourself——
        </p>
      </footer>
    </div>
  );
}
