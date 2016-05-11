<?php

/**
 * Class React_Html_Serializer
 *
 * Serialize HTML to associative array
 */

class React_Html_Serializer {

    protected function _filter_attributes( $node , $attributes )
    {
        $filtered = [];
        foreach( $attributes as $attribute ) {
            $attr = mb_strtolower( $attribute->name );
            $value = $attribute->value;
            if($attr === 'style') {
                continue;
            }
            if($attr === 'class') {
                $attr = 'className';
            }
            elseif($attr === 'srcset') {
                $attr = 'srcSet';
            }
            elseif($attr === 'xlink:href') {
                $attr = 'xlinkHref';
            }

            $filtered[ $attr ] = $value;
        }
        return $filtered;
    }

    protected function _html_dom_element_to_array( DOMElement $element )
    {
        $node = mb_strtolower( $element->tagName );
        $item = [
            'node' => $node,
        ];

        if( $element->attributes->length > 0 && $attributes = $this->_filter_attributes( $node, $element->attributes ) ) {
            $item['attr'] = $attributes;
        }

        if( $element->hasChildNodes() ) {
            $item['children'] = [];
            foreach( $element->childNodes as $subElement ) {
                if ( XML_ELEMENT_NODE === $subElement->nodeType ) {
                    $item['children'][] = $this->_html_dom_element_to_array($subElement);
                }
                elseif ( XML_TEXT_NODE === $subElement->nodeType ) {
                    $text = str_replace( ["\n", "\r"], ' ', $subElement->nodeValue );
                    if( '' != str_replace( ' ', '', $text ) ) {
                        $item['children'][] = [
                            'node' => 'text',
                            'text' => $text
                        ];
                    }
                }
            }
            if( 0 == count( $item['children'] ) ) {
                unset( $item['children'] );
            }
        }
        return $item;
    }


    protected function _remove_excess_paragraphs( &$tree )
    {
        foreach( $tree as $key => $item ) {

            if( 'p' === $item['node'] && ! empty( $item['children'] ) ) {
                $invalid = false;
                foreach( $item['children'] as $child ) {
                    if( in_array( $child['node'], ['div', 'iframe', 'p', 'blockquote'] ) ) {
                        $invalid = true;
                        break;
                    }

                }

                if( $invalid ) {
                    $tree[ $key ]['node'] = 'div';
                }
            }
            elseif( ! empty( $item['children'] ) ) {
                $this->_remove_excess_paragraphs( $tree[ $key ]['children'] );
            }
        }
    }

    public function serialize( $content )
    {
        if( empty( $content ) ) {
            return [];
        }

        $dom = new DOMDocument( '1.0', 'UTF-8' );

        $html = "<!DOCTYPE html><html><head><meta charset='UTF-8' /></head><body>$content</body></html>";

        try {
            libxml_use_internal_errors( true );
            $dom->loadHTML( $html );
            libxml_clear_errors();
        }
        catch( Exception $e ) {
            return null;
        }

        $root_element = $dom->getElementsByTagName('body')[0];

        $array = $this->_html_dom_element_to_array( $root_element );
        if( empty( $array ) || ! isset( $array['children'] ) ) {
            return null;
        }
        $array = $array['children'];

        $this->_remove_excess_paragraphs( $array );

        return $array;
    }

}