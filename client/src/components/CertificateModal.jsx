import React, { useRef, useEffect } from 'react';
import { Award, Download, X, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button.jsx';

export function CertificateModal({ isOpen, onClose, courseTitle, studentName, completionDate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // Fundo Gradiente Escuro Sofisticado
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0E141B');
    bgGrad.addColorStop(0.5, '#171D26');
    bgGrad.addColorStop(1, '#0E141B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Borda Decorativa Dourada/Azul
    ctx.strokeStyle = '#5B8DFF';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = '#2954C8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // Cantos decorativos
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#5B8DFF';
      ctx.fillRect(x - 10, y - 10, 20, 20);
    };
    drawCorner(40, 40);
    drawCorner(width - 40, 40);
    drawCorner(40, height - 40);
    drawCorner(width - 40, height - 40);

    // Marca / Logo iziCripto
    ctx.fillStyle = '#5B8DFF';
    ctx.font = 'bold 36px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('iziCripto', width / 2, 130);

    ctx.fillStyle = '#8A93AC';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.letterSpacing = '4px';
    ctx.fillText('CERTIFICADO OFICIAL DE CONCLUSÃO', width / 2, 175);

    // Texto de Certificação
    ctx.fillStyle = '#C7D0E2';
    ctx.font = '20px "Varela Round", sans-serif';
    ctx.fillText('Certificamos para os devidos fins que', width / 2, 260);

    // Nome do Aluno
    ctx.fillStyle = '#F5F8FF';
    ctx.font = 'bold 44px Montserrat, sans-serif';
    ctx.fillText(studentName || 'Estudante Web3', width / 2, 330);

    // Linha divisória sutil
    ctx.strokeStyle = '#28324A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 365);
    ctx.lineTo(width / 2 + 200, 365);
    ctx.stroke();

    // Texto do Curso
    ctx.fillStyle = '#C7D0E2';
    ctx.font = '20px "Varela Round", sans-serif';
    ctx.fillText('concluiu com êxito todos os módulos e aulas do curso', width / 2, 420);

    ctx.fillStyle = '#5B8DFF';
    ctx.font = 'bold 32px Montserrat, sans-serif';
    ctx.fillText(`"${courseTitle}"`, width / 2, 480);

    // Data e Assinatura
    const dateStr = completionDate || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    ctx.fillStyle = '#8A93AC';
    ctx.font = '16px "Varela Round", sans-serif';
    ctx.fillText(`Emitido em ${dateStr}`, width / 2, 570);

    // Selo de Autenticidade
    ctx.strokeStyle = '#2FAE6E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, 655, 35, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#2FAE6E';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('VERIFICADO', width / 2, 650);
    ctx.fillText('100% CONCLUÍDO', width / 2, 668);

  }, [isOpen, courseTitle, studentName, completionDate]);

  if (!isOpen) return null;

  const downloadCertificate = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Certificado-iziCripto-${courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-panel rounded-2xl border border-sim-border shadow-2xl p-6 text-on-dark-strong flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-dark-muted hover:text-on-dark-strong p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-good font-semibold text-sm mb-2">
          <Sparkles size={18} /> Parabéns pela conquista!
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Seu Certificado de Conclusão</h2>
        <p className="text-sm text-on-dark-muted text-center mb-6 max-w-lg">
          Você finalizou 100% das aulas de <span className="text-accent font-semibold">{courseTitle}</span>.
        </p>

        <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-sim-border shadow-lg bg-ink">
          <canvas ref={canvasRef} className="w-full h-auto block" />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <Button onClick={downloadCertificate} className="flex items-center gap-2 bg-accent text-ink hover:bg-accent/90">
            <Download size={16} /> Baixar Certificado (PNG em Alta Resolução)
          </Button>
          <Button onClick={onClose} variant="ghost" className="text-on-dark-muted hover:text-on-dark-strong">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
