'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

function FilterBadge({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Badge variant='outline' className='gap-2 rounded-full pl-4'>
      {children}
      <Button
        variant='ghost'
        className='rounded-full hover:text-red-500'
        size='icon'
        onClick={onClick}
      >
        <IoMdClose className='size-4' />
      </Button>
    </Badge>
  );
}

export default function FilterListSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleDeleteCity = (city: string) => {
    const _cities = cities.filter((c) => c !== city);
    setCities(_cities);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('city', _cities.length > 0 ? _cities.join(',') : 'all');
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleDeleteCategory = (category: string) => {
    const _categories = categories.filter((c) => c !== category);
    setCategories(_categories);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      'category',
      _categories.length > 0 ? _categories.join(',') : 'all'
    );
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleDeleteHashtag = (hashtag: string) => {
    const _hashtags = hashtags.filter((c) => c !== hashtag);
    setHashtags(_hashtags);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      'hashtag',
      _hashtags.length > 0 ? _hashtags.join(',') : 'all'
    );
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleDeleteMoney = () => {
    setMinPrice('');
    setMaxPrice('');
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('money', 'all');
    router.push(`?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    const _cities = (
      searchParams.get('city') === 'all'
        ? []
        : (searchParams.get('city') || '').split(',')
    ).filter((c) => c !== '');
    const _categories = (
      searchParams.get('category') === 'all'
        ? []
        : (searchParams.get('category') || '').split(',')
    ).filter((c) => c !== '');
    const _hashtags = (
      searchParams.get('hashtag') === 'all'
        ? []
        : (searchParams.get('hashtag') || '').split(',')
    ).filter((c) => c !== '');
    const [_minPrice, _maxPrice] =
      searchParams.get('money') === 'all'
        ? []
        : (searchParams.get('money') || '').split('-');

    setCities(_cities);
    setCategories(_categories);
    setHashtags(_hashtags);
    setMinPrice(_minPrice || '');
    setMaxPrice(_maxPrice || '');
    console.log(_cities, _categories, _hashtags);
  }, [searchParams]);

  return (
    <div className='flex w-full flex-wrap gap-2'>
      {cities.map((city) => (
        <FilterBadge onClick={() => handleDeleteCity(city)}>{city}</FilterBadge>
      ))}
      {categories.map((category) => (
        <FilterBadge onClick={() => handleDeleteCategory(category)}>
          {category}
        </FilterBadge>
      ))}
      {hashtags.map((hashtag) => (
        <FilterBadge onClick={() => handleDeleteHashtag(hashtag)}>
          {hashtag}
        </FilterBadge>
      ))}
      {minPrice && maxPrice && (
        <FilterBadge onClick={handleDeleteMoney}>
          ${minPrice} - ${maxPrice}
        </FilterBadge>
      )}
      {minPrice && !maxPrice && (
        <FilterBadge onClick={handleDeleteMoney}>
          ${minPrice}
          {' <'}
        </FilterBadge>
      )}
      {!minPrice && maxPrice && (
        <FilterBadge onClick={handleDeleteMoney}>
          {'< '}${maxPrice}
        </FilterBadge>
      )}
    </div>
  );
}