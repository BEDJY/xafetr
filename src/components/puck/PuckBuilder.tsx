import React, { useState, useRef, useMemo } from 'react';
import { Puck, type Data } from '@puckeditor/core';
import '@puckeditor/core/dist/index.css';
import { createAiPlugin } from '@puckeditor/plugin-ai';
import '@puckeditor/plugin-ai/styles.css';
import { useAI } from '../../context/AIContext';
import {
  puckConfig,
  defaultStoreData,
  techStoreData,
  fashionStoreData,
  type StorePuckProps,
} from './puckConfig';
import {
  Save,
  Download,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  HelpCircle,
} from 'lucide-react';

interface PuckBuilderProps {
  initialData: Data<StorePuckProps>;
  channelId: string;
  channelCode: string;
  onSave: (data: Data<StorePuckProps>) => void;
  onSwitchToPreview?: () => void;
}

export default function PuckBuilder({
  initialData,
  channelId,
  channelCode,
  onSave,
  onSwitchToPreview,
}: PuckBuilderProps) {
  const { setIsOpen: setIsAIOpen } = useAI();
  const [data, setData] = useState<Data<StorePuckProps>>(initialData);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Native Puck AI Plugin
  const aiPlugin = useMemo(
    () =>
      createAiPlugin({
        host: '/api/puck/chat',
        defaultMode: 'assembly',
        chat: {
          examplePrompts: [
            { label: '✨ Crear Hero Banner atractivo' },
            { label: '⚡ Agregar Ofertas Flash' },
            { label: '🌟 Agregar Productos Destacados' },
            { label: '🚚 Agregar Beneficios de Envío' },
          ],
        },
      }),
    []
  );

  const handleDataChange = (newData: Data<StorePuckProps>) => {
    setData(newData);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSaveClick = (dataToSave?: Data<StorePuckProps>) => {
    const payload = dataToSave || data;
    onSave(payload);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleApplyTemplate = (templateData: Data<StorePuckProps>) => {
    if (
      hasChanges &&
      !window.confirm('¿Deseas reemplazar el diseño actual con esta plantilla? Se perderán los cambios no guardados.')
    ) {
      return;
    }
    setData(templateData);
    setHasChanges(true);
    setShowTemplatesModal(false);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `store-layout-${channelCode || channelId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.content && Array.isArray(parsed.content)) {
          setData(parsed);
          setHasChanges(true);
          alert('¡Diseño importado con éxito!');
        } else {
          alert('El archivo JSON no tiene un formato válido de Puck.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2">
          {/* Templates button */}
          <button
            type="button"
            onClick={() => setShowTemplatesModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Plantillas Prediseñadas</span>
          </button>

          {/* AI Ideas button (Calls Puck Native AI) */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.__PUCK_AI?.focus) {
                window.__PUCK_AI.focus();
              } else {
                setIsAIOpen(true);
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition cursor-pointer"
            title="Abrir Chat IA Nativo de Puck"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            <span className="hidden sm:inline">Chat IA Puck</span>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 transition cursor-pointer"
            title="Exportar diseño como archivo JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar JSON</span>
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 transition cursor-pointer"
            title="Importar diseño desde un archivo JSON"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Importar JSON</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json,application/json"
            className="hidden"
          />

          {/* Help button */}
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-1 rounded-xl p-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            title="¿Cómo funciona el editor visual Puck?"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              <span>Guardado</span>
            </span>
          )}

          {hasChanges && !saveSuccess && (
            <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cambios sin guardar</span>
            </span>
          )}

          {onSwitchToPreview && (
            <button
              type="button"
              onClick={onSwitchToPreview}
              className="flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/60 transition cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Ver Tienda</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSaveClick()}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Guardar Diseño</span>
          </button>
        </div>
      </div>

      {/* Puck Editor Viewport Container */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm h-[750px] relative">
        <Puck
          config={puckConfig}
          data={data}
          onChange={handleDataChange}
          onPublish={(publishedData) => handleSaveClick(publishedData)}
          plugins={[aiPlugin]}
          iframe={{ enabled: false }}
          headerTitle={`Diseño Home • ${channelCode || 'Tienda'}`}
          headerPath="/"
        />
      </div>

      {/* Modal: Templates Selector */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Seleccionar Plantilla de Inicio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold"
              >
                ✕ Cerrar
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Escoge una plantilla prediseñada para configurar tu página de inicio al instante. Puedes personalizar todos sus textos, fotos y colores luego.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Template 1: General eCommerce */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-4 flex flex-col justify-between space-y-3 hover:border-sky-500 transition">
                <div>
                  <span className="inline-block rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 text-[10px] font-bold mb-2">
                    RECOMENDADA
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                    Comercio General
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Hero llamativo, barra de anuncios, beneficios de envío, ofertas flash, productos top y testimonios.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate(defaultStoreData)}
                  className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 text-white py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Usar Plantilla
                </button>
              </div>

              {/* Template 2: Tech & Gadgets */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-4 flex flex-col justify-between space-y-3 hover:border-sky-500 transition">
                <div>
                  <span className="inline-block rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 text-[10px] font-bold mb-2">
                    TECNOLOGÍA
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                    Tech & Gadgets
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Banner oscuro de alta tecnología, garantía oficial, cuadrícula de dispositivos y club de suscriptores.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate(techStoreData)}
                  className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 text-white py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Usar Plantilla
                </button>
              </div>

              {/* Template 3: Fashion & Lifestyle */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-4 flex flex-col justify-between space-y-3 hover:border-sky-500 transition">
                <div>
                  <span className="inline-block rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 text-[10px] font-bold mb-2">
                    MODA & ESTILO
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                    Moda & Calzado
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Lookbook fotográfico, categorías visuales elegantes, historia de la marca y acceso VIP.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate(fashionStoreData)}
                  className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 text-white py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Usar Plantilla
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800 flex justify-between items-center">
              <button
                type="button"
                onClick={() =>
                  handleApplyTemplate({
                    content: [],
                    root: { props: { title: 'Página Vacía' } },
                  })
                }
                className="text-xs text-rose-500 hover:underline font-semibold"
              >
                Empezar con Lienzo en Blanco
              </button>
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Help & Instructions */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-sky-500" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  ¿Cómo usar el Editor Visual Puck?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold shrink-0">
                  1
                </span>
                <p>
                  <strong>Arrastra y Suelta:</strong> En el panel izquierdo encontrarás los componentes (Hero, Ofertas Flash, Productos, Beneficios, Testimonios, etc.). Arrástralos directamente a la posición deseada en el lienzo central.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold shrink-0">
                  2
                </span>
                <p>
                  <strong>Personaliza los Campos:</strong> Haz clic sobre cualquier bloque en el lienzo para seleccionarlo. En el panel lateral derecho podrás editar sus títulos, enlaces, textos y colores.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold shrink-0">
                  3
                </span>
                <p>
                  <strong>Reorganiza o Elimina:</strong> Puedes arrastrar un bloque arriba o abajo para cambiar su orden, o hacer clic en el ícono de papelera para removerlo.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold shrink-0">
                  4
                </span>
                <p>
                  <strong>Guarda tus Cambios:</strong> Haz clic en el botón <strong>"Guardar Diseño"</strong> o <strong>"Publish"</strong> para conservar las modificaciones en tu tienda.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="rounded-xl bg-zinc-900 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
