"use client"

import * as React from "react"
import { X } from "lucide-react"

interface DialogContextType {
    open: boolean
    setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

export function Dialog({
    open: controlledOpen,
    onOpenChange,
    children,
}: {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen

    const setOpen = React.useCallback(
        (value: boolean) => {
            if (onOpenChange) onOpenChange(value)
            else setUncontrolledOpen(value)
        },
        [onOpenChange]
    )

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {children}
        </DialogContext.Provider>
    )
}

export function DialogTrigger({
    children,
}: {
    asChild?: boolean
    children: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
}) {
    const context = React.useContext(DialogContext)
    if (!context) return children

    const handleClick = (e: React.MouseEvent) => {
        children.props?.onClick?.(e)
        context.setOpen(true)
    }

    return React.cloneElement(children, { onClick: handleClick })
}

export function DialogContent({
    className = "",
    children,
}: {
    className?: string
    children: React.ReactNode
}) {
    const context = React.useContext(DialogContext)
    if (!context || !context.open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => context.setOpen(false)}
            />
            <div
                className={`relative z-50 w-full rounded-2xl border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${className}`}
            >
                <button
                    onClick={() => context.setOpen(false)}
                    className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <X size={18} />
                </button>
                {children}
            </div>
        </div>
    )
}

export function DialogHeader({
    className = "",
    children,
}: {
    className?: string
    children: React.ReactNode
}) {
    return <div className={`flex flex-col space-y-1.5 text-left mb-4 ${className}`}>{children}</div>
}

export function DialogTitle({
    className = "",
    children,
}: {
    className?: string
    children: React.ReactNode
}) {
    return <h2 className={`text-xl font-bold tracking-tight text-foreground ${className}`}>{children}</h2>
}
