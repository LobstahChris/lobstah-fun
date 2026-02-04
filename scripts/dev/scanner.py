import os
import json
import subprocess
from datetime import datetime

# SSoT Protocol Version: 1.3.2 (2026-02-03)
# - Daily roll-up with accordion (details) support
# - Atomic entry per update block
# - No redundant H1 headers
# - JSON/MDX syntax escaping for build safety
VERSION = "1.3.2"

# Config
API_KEY = os.environ.get("MOLTBOOK_API_KEY")
REPO_ROOT = "/home/ubuntu/.openclaw/Desktop/projects/lobstah-fun"
PROJECT_DOMAIN = "moltbook.com"
INTEL_DIR = f"{REPO_ROOT}/web/content/docs/project-spotlights/research/{PROJECT_DOMAIN}"

def strip_tags(text):
    """Strip HTML-like tags and escape JSON-like braces to prevent MDX build errors."""
    import re
    if text is None:
        return ""
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Escape { and } by wrapping in code blocks or using backticks if they look like JSON
    # For now, let's just use a simple replacement for braces that break MDX expressions
    text = text.replace('{', '&#123;').replace('}', '&#125;')
    return text

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
    submolts = ["shipping", "openclaw-explorers", "ai-agents", "general"]
    all_posts = []
    for sub in submolts:
        all_posts.extend(fetch_feed(sub))
    
    if not all_posts:
        return

    all_posts.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    today_str = datetime.now().strftime('%Y-%m-%d')
    daily_path = os.path.join(INTEL_DIR, f"{today_str}.mdx")
    os.makedirs(INTEL_DIR, exist_ok=True)
    
    timestamp = datetime.now().strftime('%H:%M:%S')
    md_block = f"### 📥 Update: {timestamp} (EST)\n"
    md_block += f"*Engine: `scanner.py` v{VERSION}*\n\n"

    for p in all_posts[:3]: 
        title = strip_tags(p.get('title', 'No Title'))
        content = strip_tags(p.get('content', ''))[:500]
        
        md_block += f"#### {title}\n"
        md_block += f"<details>\n<summary>View Original Post</summary>\n"
        md_block += f"{content}\n"
        md_block += f"</details>\n\n"
        md_block += f"> **LobstahLead 🦞 Comment:** [DRAFT] Automated intake for review.\n\n---\n\n"

    file_exists = os.path.isfile(daily_path)
    with open(daily_path, "a") as f:
        if not file_exists:
            f.write("---\n")
            f.write(f"title: \"{today_str}\"\n")
            f.write(f"description: Curated intelligence for {PROJECT_DOMAIN}.\n")
            f.write("---\n\n")
        
        f.write(md_block)

if __name__ == "__main__":
    generate_report()
