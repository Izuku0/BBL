export default function Footer() {
    return (
        <footer className="bg-[#050B14] text-gray-500 py-10 pb-32 sm:pb-10 text-center text-[10px] font-black uppercase tracking-[0.3em] border-t border-white/5 mt-auto relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                <p className="mb-2">Banjara Bigg Bash League • Season 2026</p>
                <p>© {new Date().getFullYear()} BCA. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
