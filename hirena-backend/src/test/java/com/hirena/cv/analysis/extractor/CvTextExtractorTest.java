package com.hirena.cv.analysis.extractor;

import com.hirena.cv.analysis.config.GeminiProperties;
import com.hirena.cv.analysis.exception.CvAnalysisException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CvTextExtractorTest {
    private final CvTextExtractor extractor = new CvTextExtractor(new GeminiProperties());

    @Test
    void extract_readsPdfText() throws Exception {
        byte[] pdf;
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            document.addPage(page);
            try (PDPageContentStream stream = new PDPageContentStream(document, page)) {
                stream.beginText();
                stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                stream.newLineAtOffset(50, 700);
                stream.showText("Java Spring Boot");
                stream.endText();
            }
            document.save(output);
            pdf = output.toByteArray();
        }

        String text = extractor.extract(new MockMultipartFile(
                "cv", "candidate.pdf", "application/pdf", pdf));

        assertEquals("Java Spring Boot", text);
    }

    @Test
    void extract_rejectsNonPdf() {
        assertThrows(CvAnalysisException.class, () -> extractor.extract(
                new MockMultipartFile("cv", "candidate.txt", "text/plain", "text".getBytes())));
    }
}
