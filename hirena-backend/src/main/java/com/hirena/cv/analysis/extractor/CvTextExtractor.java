package com.hirena.cv.analysis.extractor;

import com.hirena.cv.analysis.exception.CvAnalysisException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import com.hirena.cv.analysis.config.GeminiProperties;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CvTextExtractor {
    private final GeminiProperties properties;

    public String extract(MultipartFile cvFile) {
        if (cvFile == null || cvFile.isEmpty()) {
            throw new CvAnalysisException("CV file must not be empty");
        }
        try {
            return extract(cvFile.getBytes(), cvFile.getOriginalFilename(), cvFile.getContentType());
        } catch (IOException e) {
            throw new CvAnalysisException("Could not read the uploaded PDF", e);
        }
    }

    public String extract(byte[] fileBytes, String fileName, String contentType) {
        if (fileBytes == null || fileBytes.length == 0) {
            throw new CvAnalysisException("CV file must not be empty");
        }
        if (fileBytes.length > properties.getMaxCvSizeBytes()) {
            throw new CvAnalysisException("CV file exceeds the 5 MB maximum size");
        }
        if (!"application/pdf".equalsIgnoreCase(contentType) && !hasPdfExtension(fileName)) {
            throw new CvAnalysisException("CV file must be a PDF");
        }
        try (PDDocument document = Loader.loadPDF(fileBytes)) {
            String text = new PDFTextStripper().getText(document)
                    .replaceAll("\\s+", " ")
                    .trim();
            if (text.isBlank()) {
                throw new CvAnalysisException("The PDF does not contain readable text");
            }
            return text;
        } catch (IOException e) {
            throw new CvAnalysisException("Could not extract text from the PDF", e);
        }
    }

    private boolean hasPdfExtension(String fileName) {
        return fileName != null && fileName.toLowerCase().endsWith(".pdf");
    }
}
