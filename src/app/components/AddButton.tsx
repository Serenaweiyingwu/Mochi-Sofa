export default function AddButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute top-5 left-5 z-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
            Add Seat
        </button>
    );
}