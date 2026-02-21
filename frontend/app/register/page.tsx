import PlayerForm from '../components/PlayerForm';

export const metadata = {
    title: 'Register Player - BBL Cricket',
};

export default function RegisterPage() {
    return (
        <div className="flex-grow bg-[#050B14] py-8 sm:py-16 px-4 md:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto relative z-10 w-full">
                <PlayerForm />
            </div>
        </div>
    );
}
