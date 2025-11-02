function solution(name, length, w, r, letters) {
    const wrappers = document.querySelectorAll('.wrapper');
    const xAxis = document.querySelector('.x-axis');
    
    wrappers.forEach(wrapper => {
        wrapper.innerHTML = '';
        wrapper.style.width = `${w}px`;
        wrapper.style.height = `${w}px`;
    });

    const letterCount = name.length;
    const totalWidth = length;
    const spacing = totalWidth / letterCount;
    
    wrappers.forEach((wrapper, index) => {
        const letter = name[index];
        const variants = letters[letter];
        
        if (variants) {
            variants.forEach((variant, variantIndex) => {
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = w;
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.opacity = variantIndex === 0 ? '1' : '0.5';
                canvas.dataset.variant = variantIndex;
                
                const ctx = canvas.getContext('2d');
                const pixelSize = w / 8;
                
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fillRect(0, 0, w, w);
                
                ctx.fillStyle = 'red';
                for (let y = 0; y < 6; y++) {
                    for (let x = 0; x < 8; x++) {
                        if (variant[y] && variant[y][x] === 1) {
                            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                        }
                    }
                }
                
                wrapper.appendChild(canvas);
            });
        }
        
        wrapper.style.position = 'absolute';
        wrapper.style.left = `${index * spacing + spacing / 2 - w / 2}px`;
        wrapper.style.transformStyle = 'preserve-3d';
    });

    wrappers.forEach((wrapper, index) => {
        const angle = (index - Math.floor(letterCount / 2)) * 10;
        const canvases = wrapper.querySelectorAll('canvas');
        
        wrapper.addEventListener('mouseenter', () => {
            canvases.forEach((canvas, canvasIndex) => {
                const checked = canvas.dataset.checked === 'true';
                canvas.style.opacity = checked ? '1' : '0.5';
                
                const rotation = checked ? 0 : (canvasIndex * 60);
                const scale = getScale(rotation);
                const translateY = checked ? r : 0;
                
                canvas.style.transform = `
                    rotateX(${angle}deg)
                    rotateY(${rotation}deg)
                    translateZ(${r}px)
                    translateY(${translateY}px)
                    scale(${scale})
                `;
                canvas.style.transition = 'transform 3s, opacity 0.3s';
            });
        });
        
        wrapper.addEventListener('mouseleave', () => {
            canvases.forEach(canvas => {
                const checked = canvas.dataset.checked === 'true';
                canvas.style.opacity = checked ? '1' : '0.5';
                canvas.style.transform = `
                    rotateX(${angle}deg)
                    rotateY(0deg)
                    translateZ(0px)
                    translateY(0px)
                    scale(1)
                `;
                canvas.style.transition = 'transform 3s, opacity 0.3s';
            });
        });
        
        wrapper.addEventListener('click', (e) => {
            if (e.target.tagName === 'CANVAS') {
                canvases.forEach(canvas => {
                    canvas.dataset.checked = 'false';
                });
                e.target.dataset.checked = 'true';
                
                wrapper.dispatchEvent(new Event('mouseenter'));
            }
        });
    });

    function getScale(rotation) {
        const normalizedRotation = ((rotation % 360) + 360) % 360;
        if (normalizedRotation === 0 || normalizedRotation === 180) return 1.25;
        if (normalizedRotation === 90 || normalizedRotation === 270) return 0.75;
        return 1;
    }
}