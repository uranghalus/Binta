import { DialogProvider } from '@/context/dialog-context';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { officeColumn } from './components/office-columns';
import OfficePrimaryButton from './components/office-primary-buttons';
import OfficesDialogs from './components/offices-dialogs';
import { OfficesTable } from './components/offices-table';
import { Office } from './data/scheme';

export default function index({ offices }: { offices: Office[] }) {
    return (
        <AppLayout title="Master Unit Bisnis">
            <Head title="Master Unit Bisnis" />
            <DialogProvider>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Data Unit Bisnis</h2>
                        <p className="text-muted-foreground">Pengelolaan data unit bisnis</p>
                    </div>
                    <OfficePrimaryButton />
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <OfficesTable data={offices} columns={officeColumn} />
                </div>
                <OfficesDialogs />
            </DialogProvider>
        </AppLayout>
    );
}
