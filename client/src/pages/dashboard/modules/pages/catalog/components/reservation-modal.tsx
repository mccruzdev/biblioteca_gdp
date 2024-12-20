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

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: Date, time: string, selectedCopy: Copy) => void;
    selectedBook: BookI | null;
    copies: Copy[];
}

export function ReservationModal({ isOpen, onClose, onConfirm, selectedBook, copies }: ReservationModalProps) {
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
            <DialogContent className="sm:max-w-[425px] bg-[#0e0e0e] border-[#3e3e40] text-[#C7C7CC]">
                <DialogHeader>
                    <DialogTitle className="text-[#FFBC24]">Realiza tu reserva</DialogTitle>
                    <DialogDescription className="text-[#C7C7CC]">
                        {selectedBook && (
                            <p>Selecciona la fecha, hora y copia para el libro "{selectedBook.title}"</p>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="copy" className="text-[#C7C7CC]">Copia del libro</Label>
                        <Select
                            value={selectedCopy?.id.toString()}
                            onValueChange={(value) => setSelectedCopy(copies.find(c => c.id === parseInt(value)) || null)}
                        >
                            <SelectTrigger id="copy" className="bg-[#141414] border-[#3e3e40] text-[#C7C7CC]">
                                <SelectValue placeholder="Selecciona una copia" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0e0e0e] border-[#3e3e40]">
                                {copies.map((copy) => (
                                    <SelectItem
                                        key={copy.id}
                                        value={copy.id.toString()}
                                        className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
                                    >
                                        {`Código: ${copy.code || 'N/A'} - Condición: ${copy.condition}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date" className="text-[#C7C7CC]">Fecha de recojo</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-[#141414] border-[#3e3e40] text-[#C7C7CC]",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#0e0e0e] border-[#3e3e40]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                    disabled={isDateDisabled}
                                    className="bg-[#0e0e0e] text-[#C7C7CC]"
                                    classNames={{
                                        day_selected: "bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24] hover:text-[#010101]",
                                        day_today: "bg-[#141414] text-[#FFBC24] font-bold",
                                    }}
                                />
                                {selectedDate && (
                                    <div className="p-2 flex justify-end">
                                        <Button
                                            size="sm"
                                            className="w-full bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80 hover:text-[#010101]"
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
                        <Label htmlFor="time" className="text-[#C7C7CC]">Hora de recojo</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger id="time" className="bg-[#141414] border-[#3e3e40] text-[#C7C7CC]">
                                <SelectValue placeholder="Selecciona una hora" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0e0e0e] border-[#3e3e40]">
                                {[...Array(10)].map((_, i) => {
                                    const hour = 7 + Math.floor(i / 2);
                                    const minute = i % 2 === 0 ? '00' : '30';
                                    return (
                                        <SelectItem
                                            key={`${hour}:${minute}`}
                                            value={`${hour}:${minute}`}
                                            className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
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
                                            className="text-[#C7C7CC] focus:bg-[#141414] focus:text-[#FFBC24]"
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
                        className="bg-[#141414] border-[#3e3e40] text-[#C7C7CC] hover:bg-[#141414]/80 hover:text-[#FFBC24]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !selectedTime || !selectedCopy}
                        className="bg-[#FFBC24] text-[#010101] hover:bg-[#FFBC24]/80 hover:text-[#010101]"
                    >
                        Reservar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

