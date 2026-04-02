import { PDFParse } from "pdf-parse";

export const extractPdfText = async (pdfBuffer) => {
    try {
        const parser = new PDFParse({ data: pdfBuffer });
        const data = await parser.getText();
        await parser.destroy();
        return data.text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return "";
    }
}
