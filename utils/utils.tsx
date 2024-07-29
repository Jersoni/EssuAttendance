export function downloadImage(imageUrl: string, filename: string) {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');   
  
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);   

    });
}