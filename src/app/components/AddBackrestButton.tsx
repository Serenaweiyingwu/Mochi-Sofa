export default function AddBackrestButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute top-16 left-5 z-10 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
            Add Backrest
        </button>
    );
}