<?php

namespace BDM\BdmVhs\ViewHelpers\Debug;

use Closure;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Fluid\View\StandaloneView;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;

class ControlViewHelper extends \TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper
{
    protected $escapeOutput = false;
    protected $escapeChildren = false;

    /**
     * Initialize arguments
     */
    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('triggerToggleSelector', 'string', 'triggerToggleSelector', false, '.site-version');
    }

    public static function renderStatic(
        array                     $arguments,
        Closure                   $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    )
    {
        $isDevelopmentContext = Environment::getContext()->isDevelopment();
        $isTestingContext = Environment::getContext()->isTesting();
        if(!$isDevelopmentContext && !$isTestingContext) {
            return "";
        }
        $triggerToggleSelector = $arguments['triggerToggleSelector'];
        $standaloneView = GeneralUtility::makeInstance(StandaloneView::class);
        $filename = 'EXT:bdm_vhs/Resources/Private/Templates/Debug/Control.html';
        $standaloneView->setTemplatePathAndFilename($filename);
        $standaloneView->setPartialRootPaths(['EXT:bdm_vhs/Resources/Private/Partials/']);
        $standaloneView->assignMultiple([
            'triggerToggleSelector' => $triggerToggleSelector,
        ]);
        $template = $standaloneView->render();
        return $template;
    }
}
