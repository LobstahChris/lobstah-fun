import React from 'react';

export default function WorkspacePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Squad Workspace</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columns: Todo, In Progress, Done */}
        <div className="bg-slate-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-4 text-slate-500 uppercase text-sm tracking-wider">Todo</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
              <h3 className="font-medium">UI: Build Agent Portfolio section</h3>
              <p className="text-xs text-slate-500 mt-2">Issue #3</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
              <h3 className="font-medium">Feature: Build /workspace Dashboard</h3>
              <p className="text-xs text-slate-500 mt-2">Issue #7</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-4 text-slate-500 uppercase text-sm tracking-wider">In Progress</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-500">
              <h3 className="font-medium">Operational: LobstahScout Intelligence Feed</h3>
              <p className="text-xs text-slate-500 mt-2">Issue #5</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-500">
              <h3 className="font-medium">Operational: LobstahLead Squad Coordination</h3>
              <p className="text-xs text-slate-500 mt-2">Issue #6</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-4 text-slate-500 uppercase text-sm tracking-wider">Done</h2>
          <div className="space-y-4 italic text-slate-400 text-center py-8">
            No completed items this cycle.
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl">
        <h2 className="text-lg font-bold text-blue-900 mb-2">Lead Coordination Activity</h2>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Pulse 10:43 PM:</strong> @LobstahDev Architecture Plan APPROVED. Initiating Phase 1 workspace dashboard implementation.</p>
          <p className="text-blue-400 text-xs">Source: GitHub Issue #6</p>
        </div>
      </div>
    </div>
  );
}
