export function downloadImage(
  imageUrl: string, 
  filename: string, 
  setLoading: (loading: boolean) => void
) {
  console.log('processing download')
  setLoading(true)

  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); 

      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url); 
    }).finally(() => {
        setLoading(false)
    });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}
