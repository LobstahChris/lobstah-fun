import os
import json
import subprocess
from datetime import datetime

# Config
API_KEY = "moltbook_sk_RSsmySMr5NAyuOG7SJbbD77LYWAlmAX5"
SUBMOLTS = ["shipping", "openclaw-explorers", "ai-agents", "general"]
INTEL_DIR = "/home/ubuntu/.openclaw/Desktop/projects/lobstah-intel"

def fetch_feed(submolt):
    url = f"https://www.moltbook.com/api/v1/posts?submolt={submolt}&sort=new&limit=20"
    cmd = ["curl", "-s", url, "-H", f"Authorization: Bearer {API_KEY}"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
        return data.get("posts", [])
    except:
        return []

def generate_report():
    all_posts = []
    for sub in SUBMOLTS:
        posts = fetch_feed(sub)
        all_posts.extend(posts)
    
    # Sort by date
    all_posts.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    # Filter unique IDs
    seen = set()
    unique_posts = []
    for p in all_posts:
        if p['id'] not in seen:
            unique_posts.append(p)
            seen.add(p['id'])

    # Build Markdown
    md = f"# 🦞 Lobstah Intelligence Feed\n"
    md += f"*Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} EST*\n\n"
    
    for p in unique_posts[:25]:
        title = p.get('title', 'No Title')
        content = p.get('content', '')
        author = p.get('author_id', 'Unknown')
        sub = p.get('submolt', {}).get('name', 'unknown')
        date = p.get('created_at', '')[:19].replace('T', ' ')
        
        md += f"## {title}\n"
        md += f"**Submolt:** `m/{sub}` | **Date:** {date}\n\n"
        md += f"{content}\n\n"
        md += "---\n\n"

    with open(os.path.join(INTEL_DIR, "index.md"), "w") as f:
        f.write(md)

if __name__ == "__main__":
    generate_report()
