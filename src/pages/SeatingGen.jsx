import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { generateSeatingPlan } from '../utils/seatingAlgorithm';
import { Settings, CheckCircle2, Zap, AlertCircle, RefreshCw, Eye, ArrowRight, XCircle } from 'lucide-react';
import './SeatingGen.css';

const SeatingGen = () => {
    const { students, halls, setSeatingPlan } = useContext(AppContext);
    const navigate = useNavigate();

    // Extract unique subjects from students for selection
    const availableSubjects = [...new Set(students.map(s => s.subjectCode))];

    const [config, setConfig] = useState({
        date: new Date().toISOString().split('T')[0],
        session: 'FN',
        subjects: availableSubjects, // Default all selected
        studentsPerTable: 2,
        antiCheatingMode: true,
        autoSelectHalls: true,
        seedModifier: ''
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [showViolations, setShowViolations] = useState(false);

    const handleSubjectToggle = (sub) => {
        if (config.subjects.includes(sub)) {
            setConfig({ ...config, subjects: config.subjects.filter(s => s !== sub) });
        } else {
            setConfig({ ...config, subjects: [...config.subjects, sub] });
        }
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setError(null);
        setGeneratedPlan(null);

        setTimeout(() => {
            const result = generateSeatingPlan(config, students, halls);

            if (result.error) {
                setError(result.error);
                setIsGenerating(false);
            } else {
                setGeneratedPlan(result.plan);
                setSeatingPlan(result.plan); // Store globally as well
                setIsGenerating(false);
            }
        }, 800);
    };

    const handleImprove = () => {
        const newModifier = Date.now().toString();
        setConfig((prev) => ({ ...prev, seedModifier: newModifier }));
        // Actually we need to run it with the new modifier immediately
        setIsGenerating(true);
        setTimeout(() => {
            const result = generateSeatingPlan({ ...config, seedModifier: newModifier }, students, halls);
            if (!result.error) {
                setGeneratedPlan(result.plan);
                setSeatingPlan(result.plan);
            }
            setIsGenerating(false);
        }, 800);
    };

    const proceedToMap = () => {
        navigate('/admin/interactive-map');
    };

    return (
        <div className="seating-gen-page animate-fade-in">
            <div className="page-header mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Seating Generator Engine</h2>
                    <p className="text-text-secondary mt-1">Configure parameters and let the smart algorithm arrange seats.</p>
                </div>
            </div>

            <div className="gen-container">
                <div className="config-panel glass-panel animate-slide-up">
                    <div className="panel-header">
                        <Settings className="text-accent-primary" />
                        <h3 className="text-lg font-semibold">Exam Configuration</h3>
                    </div>

                    <div className="config-form">
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label>Exam Date</label>
                                <input
                                    type="date"
                                    value={config.date}
                                    onChange={e => setConfig({ ...config, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group flex-1">
                                <label>Session</label>
                                <select value={config.session} onChange={e => setConfig({ ...config, session: e.target.value })}>
                                    <option value="FN">Forenoon (FN) - 9:30 AM</option>
                                    <option value="AN">Afternoon (AN) - 1:30 PM</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Select Subjects Scheduled for Exam</label>
                            <div className="subject-pills">
                                {availableSubjects.map(sub => (
                                    <button
                                        key={sub}
                                        className={`subject-pill ${config.subjects.includes(sub) ? 'selected' : ''}`}
                                        onClick={() => handleSubjectToggle(sub)}
                                    >
                                        {config.subjects.includes(sub) && <CheckCircle2 size={14} />}
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label>Students per Table</label>
                                <select value={config.studentsPerTable} onChange={e => setConfig({ ...config, studentsPerTable: Number(e.target.value) })}>
                                    <option value={1}>1 Student</option>
                                    <option value={2}>2 Students (Recommended)</option>
                                </select>
                            </div>
                        </div>

                        <div className="smart-features-section">
                            <h4 className="section-subtitle">Smart Optimization Engine</h4>

                            <div className="feature-toggle glass-panel">
                                <div className="feature-info">
                                    <div className="feature-title">
                                        <Zap size={18} className="text-status-warning fill-current" />
                                        Auto Select Best Halls
                                    </div>
                                    <p className="text-sm text-text-secondary">System intelligently calculates optimal halls based on capacity and availability.</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={config.autoSelectHalls}
                                        onChange={e => setConfig({ ...config, autoSelectHalls: e.target.checked })}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="feature-toggle glass-panel">
                                <div className="feature-info">
                                    <div className="feature-title">
                                        <AlertCircle size={18} className="text-accent-primary" />
                                        Strict Anti-Cheating Mode
                                    </div>
                                    <p className="text-sm text-text-secondary">Avoids placing same subject students adjacent to each other.</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={config.antiCheatingMode}
                                        onChange={e => setConfig({ ...config, antiCheatingMode: e.target.checked })}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="error-alert">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            className={`btn-primary generate-btn ${isGenerating ? 'loading' : ''}`}
                            onClick={handleGenerate}
                            disabled={isGenerating || config.subjects.length === 0}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="loader small-loader"></span>
                                    Processing Algorithm...
                                </>
                            ) : (
                                <>
                                    <Settings className="spinner-icon" size={20} />
                                    Generate Smart Seating Plan
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {generatedPlan ? (
                    <div className="feedback-panel glass-panel animate-slide-up delay-100 p-6 flex flex-col justify-center">
                        <div className="panel-header mb-4">
                            <Zap className="text-status-success" size={24} />
                            <h3 className="text-xl font-bold text-gradient">Optimization Feedback Details</h3>
                        </div>
                        
                        <div className="feedback-stats grid gap-4 mb-6">
                            <div className="stat-card p-4 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]">
                                <span className="text-sm text-text-secondary block">Total Students Allocated</span>
                                <strong className="text-2xl text-accent-primary">{generatedPlan.totalStudentsAssigned}</strong>
                            </div>
                            <div className="stat-card p-4 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]">
                                <span className="text-sm text-text-secondary block">Violations Count</span>
                                <strong className={`text-2xl ${generatedPlan.algorithmMetadata.totalViolations > 0 ? 'text-status-danger' : 'text-status-success'}`}>
                                    {generatedPlan.algorithmMetadata.totalViolations}
                                </strong>
                            </div>
                            <div className="stat-card p-4 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]">
                                <span className="text-sm text-text-secondary block">Constraints Applied</span>
                                <strong className="text-lg text-text-primary">Anti-Cheating, Hall Cap</strong>
                            </div>
                        </div>

                        {showViolations && generatedPlan.algorithmMetadata.totalViolations > 0 && (
                            <div className="violations-list mb-6 p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-left text-sm">
                                <h4 className="font-bold text-status-danger flex items-center gap-2 mb-2"><XCircle size={16}/> Warning: Unavoidable Conflicts</h4>
                                <ul className="list-disc pl-5 text-text-secondary">
                                    <li>Same subject adjacency: The algorithm was forced to place some students with identical subjects near each other due to dense ratios.</li>
                                    <li>Tip: Reduce the number of students taking the same exam per hall to 0.</li>
                                </ul>
                            </div>
                        )}

                        <div className="action-buttons flex gap-3 flex-wrap">
                            <button className="btn-secondary flex-1" onClick={() => setShowViolations(!showViolations)}>
                                <Eye size={18} />
                                {showViolations ? 'Hide Violations' : 'View Violations'}
                            </button>
                            <button className="btn-warning flex-1" onClick={handleImprove} disabled={isGenerating}>
                                <RefreshCw size={18} className={isGenerating ? "spin" : ""} />
                                Improve Allocation
                            </button>
                            <button className="btn-primary w-full mt-2 justify-center" onClick={proceedToMap}>
                                Proceed to Map View
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="info-panel animate-slide-up delay-100">
                        <div className="glass-panel p-6 h-full flex flex-col justify-center text-center">
                            <div className="hero-icon-container mx-auto mb-4">
                                <Zap size={48} className="text-accent-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gradient">How it Works</h3>
                            <p className="text-text-secondary mb-4 text-sm">
                                Our advanced seating engine calculates the minimum number of halls required,
                                distributes students to prevent consecutive subjects, and optimizes table space.
                            </p>
                            <ul className="text-left text-sm text-text-secondary flex flex-col gap-3">
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-status-success" /> Capacity analyzed instantly</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-status-success" /> Multi-subject interleaving</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-status-success" /> AI Cheat-risk validation</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatingGen;
