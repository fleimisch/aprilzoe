export async function load() {
    const posts = await Promise.all(
        Object.entries(import.meta.glob('./posts/*.md', { eager: true })).map(async ([path, post]: [string, any]) => {
            const slug = path.split('/').pop()?.slice(0, -3); // Remove .md extension
            return { 
                ...post.metadata,
                slug 
            };
        })
    );

    // Sort posts by date
    return {
        posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
} 