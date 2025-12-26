import { useUsersHandler } from "~/server/util/usersHandler";
import { useDocsHandler } from "~/server/util/docsHandler";
import archiver from "archiver";
import { PassThrough } from "stream";

export default defineEventHandler(async (event) => {
    const { getUserByCookie } = useUsersHandler();
    const { getUserDocs } = useDocsHandler();
    
    // Authenticate user
    const user = await getUserByCookie(event);
    if (!user) {
        setResponseStatus(event, 401);
        return { error: "Not authenticated" };
    }

    try {
        // Get all user documents
        const docs = await getUserDocs(user.id);
        
        if (docs.length === 0) {
            setResponseStatus(event, 404);
            return { error: "No documents to export" };
        }

        // Create ZIP archive
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // Set response headers for ZIP download
        setResponseHeaders(event, {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="worse-documents-${new Date().toISOString().split('T')[0]}.zip"`,
        });

        // Create a PassThrough stream to pipe the archive
        const passThrough = new PassThrough();
        archive.pipe(passThrough);

        // Add each document to the archive
        for (const doc of docs) {
            const fileName = `${doc.name || doc.id}.html`;
            const content = doc.content || '<p>Empty document</p>';
            
            // Wrap content in basic HTML structure
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.name || 'Untitled'}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
            
            archive.append(htmlContent, { name: fileName });
        }

        // Finalize the archive
        archive.finalize();

        // Return the stream directly
        return sendStream(event, passThrough);
    } catch (error: any) {
        console.error("Failed to export documents:", error);
        setResponseStatus(event, 500);
        return { error: error.message || "Failed to export documents" };
    }
});
