import React from 'react';
import { FolderGit2 } from 'lucide-react';

const ProjectPlaceholder = () => {
    return (
        <div className="group relative h-64 w-full overflow-hidden rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-6 transition-all hover:border-cyan-500/30 hover:bg-slate-900/50">
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-50 transition-opacity group-hover:opacity-80">
                <div className="rounded-full bg-slate-900 p-4 ring-1 ring-slate-800 transition-all group-hover:ring-cyan-500/20">
                    <FolderGit2 className="h-8 w-8 text-slate-600 transition-colors group-hover:text-cyan-400" />
                </div>
                <div className="text-center">
                    <h3 className="font-mono text-lg font-semibold text-slate-400 group-hover:text-cyan-200">
                        Client Build [Coming Soon]
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                        Case Study In Progress
                    </p>
                </div>
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-slate-800 opacity-0 transition-all group-hover:opacity-100" />
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-slate-800 opacity-0 transition-all group-hover:opacity-100" />
        </div>
    );
};

export default ProjectPlaceholder;
