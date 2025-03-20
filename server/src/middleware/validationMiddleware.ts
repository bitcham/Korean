import { Request, Response, NextFunction } from 'express';

/**
 * Validate ID parameter to ensure it's a number
 */
export const validateIdParam = (req: Request, res: Response, next: NextFunction): void => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({
            success: false,
            error: 'Invalid ID format. Must be a number'
        });
        return;
    }

    next();
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;

    if (page !== undefined && (isNaN(page) || page < 1)) {
        res.status(400).json({
            success: false,
            error: 'Page must be a positive number'
        });
        return;
    }

    if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
        res.status(400).json({
            success: false,
            error: 'Limit must be a number between 1 and 100'
        });
        return;
    }

    next();
}; 