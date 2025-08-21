import { apiRequest } from "./queryClient";

export async function exportToExcel() {
  try {
    const response = await fetch("/api/export/excel", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calificaciones_cortos.xlsx";
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
}
