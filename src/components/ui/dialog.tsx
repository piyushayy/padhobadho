"use client"

import * as React from "react"
import { X } from "lucide-react"

interface DialogContextType {
    open: boolean
    setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

export function Dialog({
    children,
    open: controlledOpen,
    onOpenChange,
}: {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    const setOpen = React.useCallback(
        (val: boolean) => {
            if (!isControlled) {
                setUncontrolledOpen(val)
            }
            onOpenChange?.(val)
        },
        [isControlled, onOpenChange]
    )

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {children}
        </DialogContext.Provider>
    )
}

export function DialogTrigger({
    children,
    asChild,
}: {
    children: React.ReactElement<any>
    asChild?: boolean
}) {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogTrigger must be used within Dialog")

    return React.cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
            children.props?.onClick?.(e)
            context.setOpen(true)
        },
    })
}

export function DialogContent({
    children,
    className = "",
}: {
    children: React.ReactNode
    className?: string
}) {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogContent must be used within Dialog")

    if (!context.open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={() => context.setOpen(false)}
            />
            <div
                className={`relative z-50 w-full rounded-2xl border bg-card p-6 shadow-xl animate-in fade-in-0 zoom-in-95 ${className}`}
            >
                <button
                    onClick={() => context.setOpen(false)}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
                {children}
            </div>
        </div>
    )
}

export function DialogHeader({
    children,
    className = "",
}: {
    children: React.ReactNode
    className?: string
}) {
    return <div className={`flex flex-col space-y-1.5 text-left mb-4 ${className}`}>{children}</div>
}

export function DialogTitle({
    children,
    className = "",
}: {
    children: React.ReactNode
    className?: string
}) {
    return <h2 className={`text-xl font-bold font-serif tracking-tight text-foreground ${className}`}>{children}</h2>
}
