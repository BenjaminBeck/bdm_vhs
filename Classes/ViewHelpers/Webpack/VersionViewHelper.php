<?php
declare(strict_types = 1);
namespace BDM\BdmVhs\ViewHelpers\Webpack;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Service\ExtensionService;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper;

/**
 * UriViewHelper
 */
class VersionViewHelper extends AbstractTagBasedViewHelper
{
    /**
     * Initialize arguments
     */
    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('path', 'string', 'path to package.json', true);
    }

    /**
     * Build an uri to current action with &tx_ext_plugin[currentPage]=2
     *
     * @return string The rendered uri
     */
    public function render(): string
    {
        // root folder of the extension
        $path = $this->arguments["path"];
        $pathToPackageJSON = GeneralUtility::getFileAbsFileName($path);
        //$pathToPackageJSON = $extensionRootFolder . 'Resources/Private/Webpack/package.json';
        $data = json_decode(file_get_contents($pathToPackageJSON), true);
        return @$data['version'] ?? "";
    }
}
