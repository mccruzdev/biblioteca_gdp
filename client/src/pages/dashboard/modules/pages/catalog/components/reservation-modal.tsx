import { useState } from "react"
import { format } from "date-fns"
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

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: Date, time: string) => void;
    selectedBook: BookI | null;
}

export function ReservationModal({ isOpen, onClose, onConfirm, selectedBook }: ReservationModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        setIsCalendarOpen(false)
    }

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            onConfirm(selectedDate, selectedTime)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Realiza tu reserva</DialogTitle>
                    <DialogDescription>
                        {selectedBook && (
                            <p>Selecciona la fecha y hora de recojo para el libro "{selectedBook.title}"</p>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="date">Fecha de recojo</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    locale={es}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                                {selectedDate && (
                                    <div className="p-2 flex justify-end">
                                        <Button size="sm" className="w-full" onClick={() => setIsCalendarOpen(false)}>
                                            <Check className="mr-2 h-4 w-4" />
                                            Aceptar
                                        </Button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="time">Hora de recojo</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger id="time">
                                <SelectValue placeholder="Selecciona una hora" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                                    <SelectItem key={hour} value={`${hour}:00`}>
                                        {`${hour}:00`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={!selectedDate || !selectedTime}>
                        Reservar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

