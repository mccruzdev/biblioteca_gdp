import { useState } from "react"
import { format, isBefore, startOfDay } from "date-fns"
import { es } from 'date-fns/locale'
import { CalendarIcon, Check } from 'lucide-react'
import { BookI } from "../../../../../../types"
import { Calendar } from "../../../../../../components/ui/calendar"
import { cn } from "../../../../../../lib/utils"
import { Button } from "../../../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../../components/ui/popover"
import { Label } from "../../../../../../components/ui/label"

type Copy = {
    id: number;
    code: string | null;
    condition: string;
};

interface LoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: Date, time: string, selectedCopy: Copy) => void;
    selectedBook: BookI | null;
    copies: Copy[];
}

export function LoanModal({ isOpen, onClose, onConfirm, selectedBook, copies }: LoanModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
    const [selectedCopy, setSelectedCopy] = useState<Copy | null>(null)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        setIsCalendarOpen(false)
    }

    const handleConfirm = () => {
        if (selectedDate && selectedTime && selectedCopy) {
            onConfirm(selectedDate, selectedTime, selectedCopy)
        }
    }

    const isDateDisabled = (date: Date) => {
        return isBefore(date, startOfDay(new Date()))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="loan-modal__content">
                <DialogHeader>
                    <DialogTitle className="loan-modal__title">Realiza tu reserva</DialogTitle>
                    <DialogDescription className="loan-modal__description">
                        {selectedBook && (
                            <p>Selecciona la fecha, hora y copia para el libro "{selectedBook.title}"</p>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="loan-modal__grid">
                    <div className="grid gap-2">
                        <Label htmlFor="copy" className="loan-modal__label">Copia del libro</Label>
                        <Select
                            value={selectedCopy?.id.toString()}
                            onValueChange={(value) => setSelectedCopy(copies.find(c => c.id === parseInt(value)) || null)}
                        >
                            <SelectTrigger id="copy" className="loan-modal__select-trigger">
                                <SelectValue placeholder="Selecciona una copia" />
                            </SelectTrigger>
                            <SelectContent className="loan-modal__select-content">
                                {copies.map((copy) => (
                                    <SelectItem
                                        key={copy.id}
                                        value={copy.id.toString()}
                                        className="loan-modal__select-item"
                                    >
                                        {`Código: ${copy.code || 'N/A'} - Condición: ${copy.condition}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date" className="loan-modal__label">Fecha de recojo</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "loan-modal__date-button",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 loan-modal__select-content" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                    disabled={isDateDisabled}
                                    className="loan-modal__calendar"
                                    classNames={{
                                        day_selected: "loan-modal__calendar-day--selected",
                                        day_today: "loan-modal__calendar-day--today",
                                    }}
                                />
                                {selectedDate && (
                                    <div className="p-2 flex justify-end">
                                        <Button
                                            size="sm"
                                            className="loan-modal__calendar-accept"
                                            onClick={() => setIsCalendarOpen(false)}
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Aceptar
                                        </Button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="time" className="loan-modal__label">Hora de recojo</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger id="time" className="loan-modal__select-trigger">
                                <SelectValue placeholder="Selecciona una hora" />
                            </SelectTrigger>
                            <SelectContent className="loan-modal__select-content">
                                {[...Array(10)].map((_, i) => {
                                    const hour = 7 + Math.floor(i / 2);
                                    const minute = i % 2 === 0 ? '00' : '30';
                                    return (
                                        <SelectItem
                                            key={`${hour}:${minute}`}
                                            value={`${hour}:${minute}`}
                                            className="loan-modal__select-item"
                                        >
                                            {`${hour.toString().padStart(2, '0')}:${minute}`}
                                        </SelectItem>
                                    );
                                })}
                                {[...Array(5)].map((_, i) => {
                                    const hour = 15 + Math.floor(i / 2);
                                    const minute = i % 2 === 0 ? '00' : '30';
                                    return (
                                        <SelectItem
                                            key={`${hour}:${minute}`}
                                            value={`${hour}:${minute}`}
                                            className="loan-modal__select-item"
                                        >
                                            {`${hour.toString().padStart(2, '0')}:${minute}`}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="loan-modal__footer-button--cancel"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !selectedTime || !selectedCopy}
                        className="loan-modal__footer-button--confirm"
                    >
                        Préstamo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

