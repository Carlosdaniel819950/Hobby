 function abrirCarta(btn) {
            var carta = btn.closest('.carta');
            var idx = carta.dataset.idx ? Number(carta.dataset.idx) : null;
            var abertaAntes = idx !== null && isCartaLida(idx);
            carta.classList.toggle('ativa');
            var aberta = carta.classList.contains('ativa');
            btn.textContent = aberta ? 'Fechar carta' : 'Abrir carta';
            if (aberta && idx !== null) {
                marcarCartaLida(idx);
                carta.classList.add('lida');
                if (abertaAntes) {
                    mostrarPopupCartaLida(idx);
                }
            }
        }

        function mostrarPopupCartaLida(idxAtual) {
            window.idxCartaAtual = idxAtual;
            document.getElementById('popup-carta-lida').style.display = 'flex';
        }

        function fecharPopupCartaLida() {
            document.getElementById('popup-carta-lida').style.display = 'none';
        }

        function continuarDeOndeParou() {
            fecharPopupCartaLida();
            let cartaAlvo = Array.from(document.querySelectorAll('.carta')).find(c => Number(c.dataset.idx) === window.idxCartaAtual);
            if (cartaAlvo) {
                cartaAlvo.scrollIntoView({behavior:'smooth', block:'center'});
                cartaAlvo.classList.add('destaque-scroll');
                setTimeout(()=>cartaAlvo.classList.remove('destaque-scroll'), 2000);
            }
        }

        function irParaProximaCarta() {
            fecharPopupCartaLida();
            let lidas = JSON.parse(localStorage.getItem('cartasLidas') || '[]');
            let todas = Array.from(document.querySelectorAll('.carta'));
            let proxima = todas.find(c => !lidas.includes(Number(c.dataset.idx)));
            if (proxima) {
                proxima.scrollIntoView({behavior:'smooth', block:'center'});
                proxima.classList.add('destaque-scroll');
                setTimeout(()=>proxima.classList.remove('destaque-scroll'), 2000);
            } else {
                alert('Você já leu todas as cartas!');
            }
        }

        function abrirTemaBranco(el) {
            var rosa = el.querySelector('.svg-rosa');
            var sol = el.querySelector('.svg-sol');
            var isClaro = document.body.classList.toggle('tema-claro');
            if (isClaro) {
                if (rosa && sol) {
                    rosa.style.display = 'none';
                    sol.style.display = 'inline-block';
                }
                document.body.style.background = '#fff';
                document.body.style.color = '#23232b';
                document.querySelectorAll('.carta').forEach(function(carta) {
                    carta.style.background = '#fff';
                    carta.style.color = '#23232b';
                    carta.style.borderColor = carta.classList.contains('lida') ? '#111' : '#e9c6f7';
                });
                document.querySelector('footer').style.color = '#b94fc6';
            } else {
                if (rosa && sol) {
                    rosa.style.display = 'inline-block';
                    sol.style.display = 'none';
                }
                document.body.style.background = 'linear-gradient(135deg, #23232b 0%, #444455 100%)';
                document.body.style.color = '#f7f7fa';
                document.querySelectorAll('.carta').forEach(function(carta) {
                    carta.style.background = '#2d2d3a';
                    carta.style.color = '#f7f7fa';
                    carta.style.borderColor = carta.classList.contains('lida') ? '#fff' : '#e9c6f7';
                });
                document.querySelector('footer').style.color = '#e9c6f7';
            }
        }

        // Sistema de leitura: marcar cartas abertas e continuar de onde parou
        function marcarCartaLida(idx) {
            let lidas = JSON.parse(localStorage.getItem('cartasLidas') || '[]');
            if (!lidas.includes(idx)) {
                lidas.push(idx);
                localStorage.setItem('cartasLidas', JSON.stringify(lidas));
            }
        }
        function isCartaLida(idx) {
            let lidas = JSON.parse(localStorage.getItem('cartasLidas') || '[]');
            return lidas.includes(idx);
        }

        // Conta quantas cartas fixas existem
        var cartasFixasCount = document.querySelectorAll('#cartas-fixas .carta').length;

        // Ao carregar, perguntar se quer continuar de onde parou
        window.addEventListener('DOMContentLoaded', function() {
            let lidas = JSON.parse(localStorage.getItem('cartasLidas') || '[]');
            let todasCartas = document.querySelectorAll('.carta');
            if (lidas.length > 0) {
                let ultima = Math.max.apply(null, lidas);
                setTimeout(function() {
                    if (confirm('Você já leu algumas cartas. Deseja continuar de onde parou?')) {
                        let cartaAlvo = Array.from(todasCartas).find(c => Number(c.dataset.idx) === ultima);
                        if (cartaAlvo) {
                            cartaAlvo.scrollIntoView({behavior:'smooth', block:'center'});
                            cartaAlvo.classList.add('destaque-scroll');
                            setTimeout(()=>cartaAlvo.classList.remove('destaque-scroll'), 2000);
                        }
                    }
                }, 400);
            }
        });

        // CSS extra para cartas lidas e destaque
        var style = document.createElement('style');
        style.innerHTML = `
        .carta.lida { border-color: #fff !important; box-shadow: 0 0 0 2px #fff6; opacity: 0.85; transition: border-color 0.3s; }
        .tema-claro .carta.lida { border-color: #111 !important; box-shadow: 0 0 0 2px #1113; }
        .carta.destaque-scroll { animation: destaqueScroll 1.2s; }
        @keyframes destaqueScroll { 0%{box-shadow:0 0 0 6px #fff9;} 100%{box-shadow:0 0 0 2px #fff6;} }`;
        document.head.appendChild(style);
