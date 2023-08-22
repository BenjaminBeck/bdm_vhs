<?php

namespace BDM\BdmVhs\ViewHelpers\Debug;

use Closure;
use TYPO3\CMS\Fluid\View\StandaloneView;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;

class LayoutViewHelper extends \TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper
{
    protected $escapeOutput = false;
    protected $escapeChildren = false;

    /**
     * Initialize arguments
     */
    public function initializeArguments()
    {
        parent::initializeArguments();
    }

    public static function renderStatic(
        array                     $arguments,
        Closure                   $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    )
    {
        $standaloneView = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(StandaloneView::class);
        $filename = 'EXT:bdm_vhs/Resources/Private/Templates/Debug/Layout.html';
        $standaloneView->setTemplatePathAndFilename($filename);
        $template = $standaloneView->render();
        return $template;
    }
}
