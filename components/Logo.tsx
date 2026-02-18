import { Layers } from 'lucide-react'

export default function Logo() {
    return (
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Layers className="w-5 h-5 text-white" />
        </div>
    )
}
